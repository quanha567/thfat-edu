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

print(f"API Key present: {bool(api_key)}")

req = urllib.request.Request(
    "https://integrate.api.nvidia.com/v1/models",
    headers={"Authorization": f"Bearer {api_key}"}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        ids = [m["id"] for m in data.get("data", [])]
        print(f"Total models: {len(ids)}")
        for x in ids:
            if any(k in x.lower() for k in ["nemotron", "parse", "vision", "ocr", "llama-3"]):
                print(" -", x)
except Exception as e:
    print("Error:", e)

