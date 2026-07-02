# 1. Use the AWS Lambda Python 3.12 base image (Amazon Linux 2023)
FROM public.ecr.aws/lambda/python:3.12

# 2. Install System Build Tools & Dependencies
# Amazon Linux 2023 uses 'dnf' (like Fedora).
# We install the exact dependencies requested for Pycairo:
# - cairo-devel
# - pkgconf-pkg-config (This provides the 'pkg-config' tool on AWS Linux)
# - python3-devel
# 
# We also need:
# - gcc, make (to compile cairo/liblouis)
# - librsvg2-tools (for rsvg-convert)
# - nodejs/npm (for prefigure math)
# - git (to clone repos)

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
# (Standard yum/dnf does not have liblouis, so we build it)
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

# 4. Install Pycairo explicitly
# We do this before prefigure to ensure the C compilation succeeds.
RUN pip install pycairo

# 5. Pin Prefigure version and share it with runtime cache keying.
ARG PREFIG_VERSION=0.5.15
ENV PREFIG_CACHE_VERSION=${PREFIG_VERSION}

# 5. Install Prefigure
# We use the [pycairo] extra to tell prefig we have it.
RUN pip install "prefig[pycairo]==${PREFIG_VERSION}"

# 6. Initialize Prefigure
# This downloads MathJax and fonts.
RUN prefig init

# 7. Copy Handler Code
WORKDIR ${LAMBDA_TASK_ROOT}
COPY app.py .

# 8. Set the CMD to your handler
CMD [ "app.lambda_handler" ]