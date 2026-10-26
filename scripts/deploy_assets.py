import json
import hashlib
import os
import shutil

STEP_361_PATH = r"C:\Users\Krunal Korat\.gemini\antigravity-ide\brain\84b1f02d-6b73-488d-bd0a-2dd30b9726aa\.system_generated\steps\361\content.md"
FRONTEND_DIR = r"c:\Users\Krunal Korat\Desktop\job finder\frontend"
THREEUI_PKG_DIR = os.path.join(FRONTEND_DIR, r"node_modules\@designcodeio\threeui")

def main():
    print("=== DEPLOYING EXACT THREEUI KAGE FILES AND ASSETS ===")
    with open(STEP_361_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    idx = text.find("{")
    data = json.loads(text[idx:])
    
    files = data.get("files", [])
    assets = data.get("assets", [])
    
    # 1. Deploy registered files
    for f in files:
        rel_path = f["path"]
        expected_sha = f["sha256"]
        expected_bytes = f["bytes"]
        dest_path = os.path.join(FRONTEND_DIR, rel_path.replace("/", os.sep))
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        if "code" in f:
            content_bytes = f["code"].encode("utf-8")
        else:
            subpath = rel_path.replace("public/", "lib-dist/assets/")
            pkg_source = os.path.join(THREEUI_PKG_DIR, subpath.replace("/", os.sep))
            with open(pkg_source, "rb") as fp:
                content_bytes = fp.read()
                
        actual_sha = hashlib.sha256(content_bytes).hexdigest()
        assert actual_sha == expected_sha, f"SHA mismatch for {rel_path}: {actual_sha} != {expected_sha}"
        assert len(content_bytes) == expected_bytes, f"Byte mismatch for {rel_path}"
        
        with open(dest_path, "wb") as fp:
            fp.write(content_bytes)
        print(f"[COPIED & VERIFIED] {rel_path} ({len(content_bytes)} bytes)")
        
    # 2. Deploy binary assets
    for a in assets:
        rel_path = a["path"]
        expected_sha = a["sha256"]
        expected_bytes = a["bytes"]
        dest_path = os.path.join(FRONTEND_DIR, rel_path.replace("/", os.sep))
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        subpath = rel_path.replace("public/", "lib-dist/assets/")
        pkg_source = os.path.join(THREEUI_PKG_DIR, subpath.replace("/", os.sep))
        with open(pkg_source, "rb") as fp:
            content_bytes = fp.read()
            
        actual_sha = hashlib.sha256(content_bytes).hexdigest()
        assert actual_sha == expected_sha, f"Asset SHA mismatch for {rel_path}: {actual_sha} != {expected_sha}"
        assert len(content_bytes) == expected_bytes, f"Asset Byte mismatch for {rel_path}"
        
        with open(dest_path, "wb") as fp:
            fp.write(content_bytes)
        print(f"[ASSET COPIED & VERIFIED] {rel_path} ({len(content_bytes)} bytes)")
        
    print("\nAll files and assets successfully copied and verified in frontend!")

if __name__ == "__main__":
    main()
