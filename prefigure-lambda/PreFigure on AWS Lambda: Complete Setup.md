# PreFigure on AWS Lambda: Complete Setup Guide

This guide documents the process of deploying the `prefigure` Python library to AWS Lambda using a Docker container, with a hybrid caching layer (RAM + DynamoDB) to optimize performance and reduce costs.

Quick endpoint verification commands are maintained in `ENDPOINT_TESTING.md`.

---

## API response contract (current)

The Lambda endpoint returns JSON and now treats `foo.xml` (annotations) as optional.

- **Success (`200`)**
    - `svg`: always present on success
    - `xml`: annotation XML string or `null` when annotations are not produced
    - `annotationsGenerated`: boolean flag indicating whether annotation XML exists
    - `cached`: whether result came from cache
    - `hash`: cache key

- **Client/build issues (`400`/`422`)**
    - `400` with `errorCode` of:
        - `invalid_encoding`
        - `empty_body`
    - `422` with `errorCode` of:
        - `build_failed` (prefig exited non-zero)
        - `svg_missing` (prefig exited zero but no SVG output)

- **Diagnostics on failures**
    - `prefigReturnCode`, `command`, `cwd`, `stdout`, `stderr`
    - Add query param `?debug=1` to include directory listings (`work_dir_contents`, `output_dir_contents`) for deeper troubleshooting.

---

## 1. Project Structure

Ensure your local directory is set up as follows:

```text
prefigure-lambda/
├── app.py           # The Python handler code (Hybrid Caching + Prefigure)
├── Dockerfile       # Instructions to build the image
├── event.json       # Local test event (optional)
└── test.html        # Browser-based test client

2. Dockerfile Configuration

We use Amazon Linux 2023 (via Python 3.12) to support modern build tools (dnf). This configuration compiles liblouis from source and installs pycairo dependencies.
Dockerfile

# 1. Use the AWS Lambda Python 3.12 base image (Amazon Linux 2023)
FROM public.ecr.aws/lambda/python:3.12

# 2. Install System Build Tools & Dependencies
RUN dnf update -y && \
    dnf install -y \
    gcc \
    gcc-c++ \
    make \
    automake \
    libtool \
    git \
    tar \
    gzip \
    zip \
    cairo-devel \
    pkgconf-pkg-config \
    python3-devel \
    librsvg2-tools \
    libxml2-devel \
    nodejs \
    npm \
    && dnf clean all

# 3. Install Liblouis (Braille support) from Source
WORKDIR /tmp/liblouis-build
RUN git clone https://github.com/liblouis/liblouis.git . && \
    ./autogen.sh && \
    ./configure --enable-ucs4 --prefix=/usr && \
    make && \
    make install && \
    cd python && \
    pip install . && \
    cd / && \
    rm -rf /tmp/liblouis-build

# 4. Install Pycairo explicitly (Pre-requisite for prefigure)
RUN pip install pycairo

# 5. Install Prefigure
RUN pip install "git+https://github.com/davidaustinm/prefigure.git#egg=prefig[pycairo]"

# 6. Initialize Prefigure (Downloads MathJax and fonts)
RUN prefig init

# 7. Copy Handler Code
WORKDIR ${LAMBDA_TASK_ROOT}
COPY app.py .

# 8. Set the CMD to your handler
CMD [ "app.lambda_handler" ]

3. Database Setup (DynamoDB)

We use DynamoDB for persistent caching (L2 Cache).

    Go to AWS Console > DynamoDB > Create table.

    Table name: PrefigureCache

    Partition key: xml_hash (String)

    Create table.

    Enable TTL (Auto-Delete Old Items):

        Select the table > Additional settings.

        Turn on Time to Live (TTL).

        TTL attribute name: expiration_time

4. Application Code (app.py)

The canonical implementation is maintained in `prefigure-lambda/app.py`.

Current handler behavior summary:

- Hybrid cache: RAM (L1) + DynamoDB (L2)
- `foo.svg` is required for success; `foo.xml` (annotations) is optional
- `xml` may be `null` with `annotationsGenerated: false`
- Error semantics:
  - `400`: `invalid_encoding`, `empty_body`
  - `422`: `build_failed`, `svg_missing`
- Diagnostics on failures include: `prefigReturnCode`, `command`, `cwd`, `stdout`, `stderr`
- Optional `?debug=1` includes file listings in error payloads

Example successful response:

```json
{
  "cached": false,
  "hash": "...",
  "xml": null,
  "svg": "<svg ...>",
  "annotationsGenerated": false
}
```

5. IAM Permissions (Least Privilege)

To allow the Lambda to write to DynamoDB safely:

    Go to IAM > Roles > Select prefigure-lambda-role.

    Add permissions > Create inline policy.

    Use the following JSON (replace [YOUR_ACCOUNT_ID]):

JSON

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DynamoDBAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-2:[YOUR_ACCOUNT_ID]:table/PrefigureCache"
        }
    ]
}

6. Build & Deploy

Run these commands in your project folder. Replace [ACCOUNT_ID] with your AWS ID.
Bash

# 1. Login to ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com

# 2. Build Image (provenance=false is critical for Lambda)
docker build --provenance=false --platform linux/amd64 -t prefigure-repo .

# 3. Tag & Push
docker tag prefigure-repo:latest ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest

# 4. Update Lambda Function
aws lambda update-function-code --function-name prefigure-function --image-uri ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest

7. Testing
Terminal (Curl)
Bash

curl -X POST https://prefigure.doenet.org/build \
  -H "Content-Type: application/xml" \
  --data-binary @test.xml

Browser (test.html)

Save this as test.html. It handles the JSON response and renders `svg` when present.
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Prefigure API Test</title>
</head>
<body>
    <h2>Prefigure API Test</h2>
    <textarea id="xmlInput" style="width:100%; height:150px;">
<diagram>
  <definition>foo = 10</definition>
  <graph>point(foo, foo)</graph>
</diagram>
    </textarea>
    <br><br>
    <button onclick="callApi()">Build Diagram</button>
    <div id="container" style="margin-top:20px; border:1px solid #ccc; padding:10px;"></div>

    <script>
        async function callApi() {
            const xml = document.getElementById('xmlInput').value;
            const container = document.getElementById('container');
            container.innerHTML = "Building...";

            try {
                const response = await fetch('https://prefigure.doenet.org/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/xml' },
                    body: xml
                });

                if (!response.ok) throw new Error(response.statusText);

                const data = await response.json();

                if (data.svg) {
                    container.innerHTML = data.svg;
                    console.log("Cache status:", data.cached ? "HIT" : "MISS");
                    console.log("Annotations generated:", data.annotationsGenerated);
                } else {
                    container.textContent = "Error: No SVG found in response.";
                }
            } catch (error) {
                container.innerHTML = `<span style="color:red">Error: ${error.message}</span>`;
            }
        }
    </script>
</body>
</html>
```
