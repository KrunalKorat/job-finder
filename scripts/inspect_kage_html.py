import os
import re

path = r"c:\Users\Krunal Korat\Desktop\job finder\frontend\node_modules\@designcodeio\threeui\lib-dist\assets\landing-pages\kage.html"
with open(path, "r", encoding="utf-8") as f:
    html = f.read()

print("Searching for asset paths in kage.html:")
tag_matches = set(re.findall(r'(?:href|src)=["\']([^"\']+)["\']', html))
for m in sorted(tag_matches):
    if any(k in m for k in ["secret-pathways", "landing-pages", "webp", "three", "font"]):
        print("  tag src/href:", m)

js_assets = set(re.findall(r'["\']([^"\']+\.(?:webp|png|jpg|js|css))["\']', html))
for m in sorted(js_assets):
    if any(k in m for k in ["secret-pathways", "kage", "temple", "webp", "three", "font"]):
        print("  js asset:", m)
