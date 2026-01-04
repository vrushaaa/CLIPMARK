import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Button from "./components/Button";
import BookmarkCard from "./components/BookmarkCard";
import Archived from "./pages/Archived";
import FavouriteBookmark from "./pages/FavouriteBookmark";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Dashboard2 from "./pages/Dashboard2";
import AllBookmark from "./pages/AllBookmark";
import Tags from "./pages/Tags";
import AllLinks from "./pages/AllLinks";
import TagBookmarks from "./pages/TagBookmarks";
import NotFound from "./pages/NotFound";

function App() {
  const [data, setData] = useState(null);

  return (
    <Router>
      {/* Your existing navbar component */}
      {/* <NavBar /> */}

      {/* Routes for all pages */}
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/api/favourites" element={<FavouriteBookmark />} />
          <Route path="/api/archived" element={<Archived />} />
          <Route path="/api/profile" element={<Profile />} />
          <Route path="/api/dashboard" element={<Dashboard2 />} />
          <Route path="/api/bookmarks" element={<AllLinks />} />
          <Route path="/api/tags" element={<Tags />} />
          {/* <Route path="/api/tags" element={<TagBookmarks/>}/> */}
          <Route path="/tags/:tagName" element={<TagBookmarks />} />
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center py-6 dark:text-[var(--color-sky-aqua-300)]">
        &copy; {new Date().getFullYear()} Clipmark. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;
