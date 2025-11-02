import json
import pyjokes

joke = pyjokes.get_joke()
print(json.dumps({"joke": joke}))