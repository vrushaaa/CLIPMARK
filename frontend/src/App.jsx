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
