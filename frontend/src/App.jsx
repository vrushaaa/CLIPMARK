import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Button from "./components/Button";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dark:bg-slate-900 bg-[#E9F9FC] h-full min-h-screen transition-colors duration-300">
      <NavBar></NavBar>

      <Button children={"Submit"}></Button>
      <h1>React + Flask Test</h1>
      <p>{data || "Loading..."}</p>
    </div>
  );
}

export default App;
