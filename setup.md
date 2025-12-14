# Project Setup Guide

## Frontend Setup (React + Vite)

### 1. Create Vite React Project

```bash
npm create vite@latest frontend
```

Follow the prompts:

* **Framework:** React
* **Variant:** JavaScript
* **Use rolldown-vite:** No
* **Install with npm and start:** Yes

> **Note:** You may see warnings about unsupported Node engine. Vite requires **Node 20.19+** or **22.12+**.

### 2. Start Dev Server

After installation:

```bash
cd frontend
npm run dev
```

If you see:

```
You are using Node.js 20.16.0. Vite requires Node.js 20.19+ or 22.12+.
```

Update Node.js.

### 3. Install Tailwind CSS

Inside `frontend/`:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

This creates:

* `tailwind.config.js`
* `postcss.config.js`

### 4. Run Frontend Again

```bash
npm run dev
```

Access at:

```
http://localhost:5173/
```

---

## Backend Setup (Flask)

### 1. Start Flask Server

Inside backend folder:

```bash
python app.py
```

Or using Flask CLI:

```bash
flask run --debug
```

Backend runs at:

```
http://127.0.0.1:5000
```

### 2. Create Test API Route

`backend/app.py`:

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})

if __name__ == "__main__":
    app.run(debug=True)
```

Restart backend and test at:

```
http://localhost:5000/test
```

Expected output:

```json
{"message": "Backend is working!"}
```

---

## Connecting Frontend and Backend

### 1. Start React Frontend

```bash
npm start
```

Runs at:

```
http://localhost:3000
```

### 2. Call Flask API From React

Edit `App.js`:

```javascript
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>React + Flask Test</h1>
      <p>{data || "Loading..."}</p>
    </div>
  );
}

export default App;
```

### 3. Test in Browser

Visit:

```
http://localhost:3000
```

You should see:

```
Backend is working!
```



hello!