import re

with open(r"c:\Users\Krunal Korat\Desktop\job finder\frontend\public\landing-pages\kage.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's inspect nav tags
navs = re.findall(r'<nav[^>]*>.*?</nav>', html, re.DOTALL)
for i, n in enumerate(navs):
    print(f"--- NAV {i} ---")
    print(n.encode('ascii', errors='replace').decode('ascii')[:600])

# Inspect header
headers = re.findall(r'<header[^>]*>.*?</header>', html, re.DOTALL)
for i, h in enumerate(headers):
    print(f"--- HEADER {i} ---")
    print(h.encode('ascii', errors='replace').decode('ascii')[:600])

# Inspect cta / buttons
buttons = re.findall(r'<button[^>]*>.*?</button>', html, re.DOTALL)
print(f"BUTTONS count: {len(buttons)}")
for b in buttons[:10]:
    print("BUTTON:", b.encode('ascii', errors='replace').decode('ascii'))
