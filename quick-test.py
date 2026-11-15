import urllib.request
import json
import os

env_path = r"D:\projects\thfat-edu\thfat-edu-be\.env"
api_key = ""
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("NVIDIA_API_KEY="):
                api_key = line.strip().split("=", 1)[1].strip("\"' ")

def test_chat(model_name):
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": "Xin chao"}],
        "max_tokens": 10
    }
    req = urllib.request.Request(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"[{model_name}] SUCCESS")
    except Exception as e:
        print(f"[{model_name}] FAILED: {e}")

test_chat("meta/llama-3.2-90b-vision-instruct")
test_chat("nvidia/llama-3.1-nemotron-70b-instruct")
test_chat("nvidia/nemotron-3-ultra-550b-a55b")

