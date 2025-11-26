### Frontend setup

1. npm create vite@latest frontend
15vru@user MINGW64 ~/CLIPMARK (main)
$ npm create vite@latest frontend
Need to install the following packages:
create-vite@8.2.0
Ok to proceed? (y) y

npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'create-vite@8.2.0',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.16.0', npm: '10.9.0' }
npm warn EBADENGINE }

> npx
> create-vite frontend

│
◇  Select a framework:
│  React
│
◆  Select a variant:
◇  Select a variant:
│  JavaScript
│
◇  Use rolldown-vite (Experimental)?:
│  No
│
◇  Install with npm and start now?
│  Yes
│
◇  Scaffolding project in C:\Users\15vru\CLIPMARK\frontend...
│
◇  Installing dependencies with npm...
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@vitejs/plugin-react@5.1.1',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.16.0', npm: '10.9.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'vite@7.2.4',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.16.0', npm: '10.9.0' }
npm warn EBADENGINE }

added 157 packages, and audited 158 packages in 3m

33 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
│
◇  Starting dev server...

◇  Starting dev server...

> frontend@0.0.0 dev
> vite
> vite

You are using Node.js 20.16.0. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.

  VITE v7.2.4  ready in 1956 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help


15vru@user MINGW64 ~/CLIPMARK (main)
$ cd frontend/

15vru@user MINGW64 ~/CLIPMARK/frontend (main)
$ npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@vitejs/plugin-react@5.1.1',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.16.0', npm: '10.9.0' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'vite@7.2.4',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.16.0', npm: '10.9.0' }
npm warn EBADENGINE }

added 63 packages, and audited 221 packages in 37s

49 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Created Tailwind CSS config file: tailwind.config.js
Created PostCSS config file: postcss.config.js

15vru@user MINGW64 ~/CLIPMARK/frontend (main)
$ npm run dev

> frontend@0.0.0 dev
> vite

You are using Node.js 20.16.0. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.
11:55:43 pm [vite] (client) Re-optimizing dependencies because lockfile has changed

  VITE v7.2.4  ready in 2717 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help




✅ Steps to Test Connection Between React (Frontend) and Flask (Backend)

Below is a reliable workflow used in real projects.

1️⃣ Start Your Flask Backend

Inside your backend folder:

python app.py


OR, if you use Flask CLI:

flask run --debug


Make sure it’s running on something like:

http://127.0.0.1:5000

2️⃣ Create a Simple Test Route in Flask

Create a basic API route in Flask to return JSON.

backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React to access Flask

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})

if __name__ == "__main__":
    app.run(debug=True)


Restart the backend.

Now open:
👉 http://localhost:5000/test

If you see:

{"message": "Backend is working!"}


then backend is OK.

3️⃣ Start the React Frontend

Navigate to the React folder:

npm start


Usually runs at:

http://localhost:3000

4️⃣ Call the Flask API from React

In React, update App.js:

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

5️⃣ Open the React App in Browser

Open:

👉 http://localhost:3000

If everything is correct, you should see:

Backend is working!