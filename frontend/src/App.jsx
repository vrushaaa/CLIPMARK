import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar";
import Button from "./components/Button";
import BookmarkCard from "./components/BookmarkCard";
import Archived from "./pages/Archived";
import FavouriteBookmark from "./pages/FavouriteBookmark";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      {/* Your existing navbar component */}
      <NavBar />

      {/* Routes for all pages */}
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/api/favourites" element={<FavouriteBookmark />} />
          <Route path="/api/archived" element={<Archived />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center py-6 dark:text-[var(--color-sky-aqua-300)]">
        &copy; {new Date().getFullYear()} Clipmark. All rights reserved.
      </footer>
    </Router>
    
  );
}

export default App;




<div className="dark:bg-slate-900 bg-[#ffffff] h-full min-h-screen transition-colors duration-300">
  <NavBar></NavBar>

  {/* <h1>React + Flask Test</h1>
  <p>{data || "Loading..."}</p> */}
  
  {/* <Home></Home> */}
  {/* <Signup></Signup> */}
  {/* <Login></Login> */}


  {/* <Archived></Archived> */}
  {/* <FavouriteBookmark></FavouriteBookmark> */}
  {/* <BookmarkCard></BookmarkCard> */}


  {/* <Button children={"Submit"}></Button> */}
</div>