# PreFigure on AWS Lambda: Complete Setup Guide

This guide documents the process of deploying the `prefigure` Python library to AWS Lambda using a Docker container, with a hybrid caching layer (RAM + DynamoDB) to optimize performance and reduce costs.

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
RUN git clone [https://github.com/liblouis/liblouis.git](https://github.com/liblouis/liblouis.git) . && \
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
RUN pip install "git+[https://github.com/davidaustinm/prefigure.git#egg=prefig](https://github.com/davidaustinm/prefigure.git#egg=prefig)[pycairo]"

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

This handler implements Hybrid Caching:

    Checks RAM (L1) -> Instant return (0ms).

    Checks DynamoDB (L2) -> Fast return (~15ms).

    Runs Prefigure (Build) -> Slow (~2s), then saves to L1 & L2.

Python

import json
import os
import subprocess
import hashlib
import boto3
import time
import base64
import shutil
from botocore.exceptions import ClientError

# --- CONFIGURATION ---
# Change this version string to invalidate old cache entries when you update the library.
CACHE_VERSION = "v0.5.7"
CACHE_DURATION_DAYS = 30

# --- INITIALIZATION ---
LOCAL_CACHE = {}
dynamodb = boto3.resource('dynamodb')
table_name = "PrefigureCache"
table = dynamodb.Table(table_name)

# --- HELPER FUNCTIONS ---
def compute_hash(content):
    unique_string = content + CACHE_VERSION
    return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()

def get_from_cache(xml_hash):
    # 1. Check L1 (RAM)
    if xml_hash in LOCAL_CACHE:
        print(f"L1 MEMORY HIT: {xml_hash}")
        return LOCAL_CACHE[xml_hash]

    # 2. Check L2 (DynamoDB)
    try:
        response = table.get_item(Key={'xml_hash': xml_hash})
        if 'Item' in response:
            print(f"L2 DYNAMO HIT: {xml_hash}")
            item = response['Item']

            # Retrieve both files
            result = {
                'xml_content': item.get('xml_content', ''),
                'svg_content': item.get('svg_content', '')
            }

            # Backfill RAM
            LOCAL_CACHE[xml_hash] = result
            return result
    except ClientError as e:
        print(f"DynamoDB Read Error: {e.response['Error']['Message']}")

    print(f"CACHE MISS: {xml_hash}")
    return None

def save_to_cache(xml_hash, xml_content, svg_content):
    result = {
        'xml_content': xml_content,
        'svg_content': svg_content
    }

    # 1. Save to RAM
    LOCAL_CACHE[xml_hash] = result

    # 2. Save to DynamoDB
    try:
        ttl_seconds = CACHE_DURATION_DAYS * 24 * 60 * 60
        expiration_time = int(time.time()) + ttl_seconds

        table.put_item(Item={
            'xml_hash': xml_hash,
            'xml_content': xml_content,
            'svg_content': svg_content,
            'expiration_time': expiration_time
        })
        print(f"Saved to L1 & L2 Cache: {xml_hash}")
    except ClientError as e:
        print(f"Failed to save to DynamoDB: {e.response['Error']['Message']}")

# --- MAIN HANDLER ---
def lambda_handler(event, context):
    # 1. Parse Input
    try:
        body = event.get('body', '')
        if event.get('isBase64Encoded', False):
            body = base64.b64decode(body).decode('utf-8')
    except Exception as e:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid encoding'})}

    if not body:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Empty body'})}

    # 2. Check Cache
    xml_hash = compute_hash(body)
    cached_data = get_from_cache(xml_hash)

    if cached_data:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'cached': True,
                'hash': xml_hash,
                'foo.xml': cached_data['xml_content'],
                'foo.svg': cached_data['svg_content']
            })
        }

    # 3. Setup Paths
    work_dir = "/tmp/prefigure_work"
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)

    # 4. Write Input
    input_filename = "foo.xml"
    input_path = os.path.join(work_dir, input_filename)
    with open(input_path, 'w') as f:
        f.write(body)

    # 5. Run Prefigure
    # We switch CWD to work_dir so 'output/' is created there
    cmd = ["prefig", "build", input_filename]
    result = subprocess.run(cmd, cwd=work_dir, capture_output=True, text=True)

    if result.returncode != 0:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Prefigure build failed',
                'stderr': result.stderr
            })
        }

    # 6. Read Outputs
    output_dir = os.path.join(work_dir, "output")
    out_xml_path = os.path.join(output_dir, "foo.xml")
    out_svg_path = os.path.join(output_dir, "foo.svg")

    if os.path.exists(out_xml_path) and os.path.exists(out_svg_path):
        with open(out_xml_path, 'r') as f:
            xml_result = f.read()
        with open(out_svg_path, 'r') as f:
            svg_result = f.read()

        save_to_cache(xml_hash, xml_result, svg_result)

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'cached': False,
                'hash': xml_hash,
                'foo.xml': xml_result,
                'foo.svg': svg_result
            })
        }
    else:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Output files not found', 'stderr': result.stderr})
        }

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
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.us-east-2.amazonaws.com

# 2. Build Image (provenance=false is critical for Lambda)
docker build --provenance=false --platform linux/amd64 -t prefigure-repo .

# 3. Tag & Push
docker tag prefigure-repo:latest [ACCOUNT_ID][.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest](https://.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest)
docker push [ACCOUNT_ID][.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest](https://.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest)

# 4. Update Lambda Function
aws lambda update-function-code --function-name prefigure-function --image-uri [ACCOUNT_ID][.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest](https://.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest)

7. Testing
Terminal (Curl)
Bash

curl -X POST [https://prefigure.doenet.org/build](https://prefigure.doenet.org/build) \
  -H "Content-Type: application/xml" \
  --data-binary @test.xml

Browser (test.html)

Save this as test.html. It handles the JSON response containing both the XML and SVG keys.
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
                const response = await fetch('[https://prefigure.doenet.org/build](https://prefigure.doenet.org/build)', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/xml' },
                    body: xml
                });

                if (!response.ok) throw new Error(response.statusText);

                const data = await response.json();

                // We look for 'foo.svg' or any key ending in .svg
                const svgKey = Object.keys(data).find(key => key.endsWith('.svg'));

                if (svgKey) {
                    container.innerHTML = data[svgKey];
                    console.log("Cache status:", data.cached ? "HIT" : "MISS");
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
