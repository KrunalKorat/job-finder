import json
import hashlib
import os

STEP_361_PATH = r"C:\Users\Krunal Korat\.gemini\antigravity-ide\brain\84b1f02d-6b73-488d-bd0a-2dd30b9726aa\.system_generated\steps\361\content.md"

def main():
    print("=== THREEUI KAGE BUNDLE & ASSET VERIFICATION ===")
    with open(STEP_361_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    idx = text.find("{")
    data = json.loads(text[idx:])
    
    print(f"Schema Version: {data.get('schemaVersion')}")
    print(f"Bundle ID: {data.get('id')}")
    
    files = data.get("files", [])
    print(f"\n--- Verifying {len(files)} Registered Source Files ---")
    all_files_pass = True
    threeui_root = r"c:\Users\Krunal Korat\Desktop\job finder\frontend\node_modules\@designcodeio\threeui"
    
    for i, f in enumerate(files):
        path = f.get("path")
        expected_sha = f.get("sha256")
        expected_bytes = f.get("bytes")
        if "code" in f:
            code_bytes = f["code"].encode("utf-8")
        else:
            subpath = path.replace("public/", "lib-dist/assets/")
            local_path = os.path.join(threeui_root, subpath.replace("/", os.sep))
            with open(local_path, "rb") as fp:
                code_bytes = fp.read()
                
        actual_sha = hashlib.sha256(code_bytes).hexdigest()
        actual_bytes = len(code_bytes)
        match_sha = (actual_sha == expected_sha)
        match_bytes = (actual_bytes == expected_bytes)
        status = "PASS" if (match_sha and match_bytes) else "FAIL"
        if status == "FAIL":
            all_files_pass = False
        print(f"[{status}] {path}")
        print(f"       Bytes: exp={expected_bytes}, act={actual_bytes} (match: {match_bytes})")
        print(f"       SHA256: exp={expected_sha}")
        print(f"               act={actual_sha} (match: {match_sha})")
        
    assets = data.get("assets", [])
    print(f"\n--- Verifying {len(assets)} Binary Assets ---")
    all_assets_pass = True
    for a in assets:
        path = a.get("path")
        expected_sha = a.get("sha256")
        expected_bytes = a.get("bytes")
        subpath = path.replace("public/", "lib-dist/assets/")
        local_path = os.path.join(threeui_root, subpath.replace("/", os.sep))
        if not os.path.exists(local_path):
            print(f"[FAIL] Missing asset: {local_path}")
            all_assets_pass = False
            continue
        with open(local_path, "rb") as fp:
            asset_bytes = fp.read()
        actual_sha = hashlib.sha256(asset_bytes).hexdigest()
        actual_bytes = len(asset_bytes)
        match_sha = (actual_sha == expected_sha)
        match_bytes = (actual_bytes == expected_bytes)
        status = "PASS" if (match_sha and match_bytes) else "FAIL"
        if status == "FAIL":
            all_assets_pass = False
        print(f"[{status}] {path}")
        print(f"       Bytes: exp={expected_bytes}, act={actual_bytes} (match: {match_bytes})")
        print(f"       SHA256: exp={expected_sha}")
        print(f"               act={actual_sha} (match: {match_sha})")
        
    print(f"\n==============================")
    print(f"All 8 registered source files verified: {all_files_pass}")
    print(f"All 14 binary assets verified: {all_assets_pass}")
    print(f"Overall Verification Result: {'SUCCESS' if (all_files_pass and all_assets_pass) else 'FAILED'}")
    print(f"==============================")

if __name__ == "__main__":
    main()
