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
            'xml_content': xml_content, # Store both
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
                'xml': cached_data['xml_content'],
                'svg': cached_data['svg_content']
            })
        }

    # 3. Setup Paths (Matching your working script)
    work_dir = "/tmp/prefigure_work"
    
    # Clean up previous runs
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)

    # 4. Write Input
    input_filename = "foo.xml"
    input_path = os.path.join(work_dir, input_filename)
    
    with open(input_path, 'w') as f:
        f.write(body)

    # 5. Run Prefigure
    cmd = ["prefig", "build", input_filename]
    
    # We switch CWD to work_dir so 'output/' is created there
    result = subprocess.run(
        cmd, 
        cwd=work_dir, 
        capture_output=True, 
        text=True
    )

    if result.returncode != 0:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Prefigure build failed',
                'stderr': result.stderr,
                'stdout': result.stdout
            })
        }

    # 6. Read Outputs
    # Prefigure creates an 'output' folder inside the work_dir
    output_dir = os.path.join(work_dir, "output")
    out_xml_path = os.path.join(output_dir, "foo.xml")
    out_svg_path = os.path.join(output_dir, "foo.svg")
    
    if os.path.exists(out_xml_path) and os.path.exists(out_svg_path):
        with open(out_xml_path, 'r') as f:
            xml_result = f.read()
        with open(out_svg_path, 'r') as f:
            svg_result = f.read()
            
        # Save both to cache
        save_to_cache(xml_hash, xml_result, svg_result)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'cached': False,
                'hash': xml_hash,
                'xml': xml_result,
                'svg': svg_result
            })
        }
    else:
        # Debugging info if files are missing
        try:
            files_in_work = os.listdir(work_dir)
            if os.path.exists(output_dir):
                files_in_output = os.listdir(output_dir)
            else:
                files_in_output = "Output directory not created"
        except Exception:
            files_in_work = "Error listing files"
            files_in_output = "Error listing files"

        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Output files not found',
                'work_dir_contents': files_in_work,
                'output_dir_contents': files_in_output,
                'stderr': result.stderr
            })
        }