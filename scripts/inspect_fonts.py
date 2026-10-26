import os
import re

path = r"c:\Users\Krunal Korat\Desktop\job finder\frontend\node_modules\@designcodeio\threeui\lib-dist\assets\landing-pages\secret-pathways-assets\fonts.css"
with open(path, "r", encoding="utf-8") as f:
    css = f.read()

urls = re.findall(r'url\((.*?)\)', css)
print("Total font URLs in fonts.css:", len(urls))
for u in urls[:10]:
    print(" ", u[:100])
