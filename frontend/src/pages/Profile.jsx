import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Settings,
  BarChart2,
  Trash2,
  Menu,
  Paperclip,
  Star,
  Archive,
  Tag,
} from "lucide-react";

import api from "../services/api"; 
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext"; 
import toast from "react-hot-toast"; 
import authService from "../services/authService";
import tagService from "../services/tagService";
import DeleteUser from "../components/modals/DeleteUser";
import bookmarkService from "../services/bookmarkService";

// --- Theme and Color Constants ---
const PRIMARY_COLOR = "#48CAE4";
const PRIMARY_TEXT_CLASS = "text-[#48CAE4]";
const TEXT_TITLE_CLASS = "text-slate-900 dark:text-white";
const TEXT_BODY_CLASS = "text-slate-600 dark:text-slate-400";
const BUTTON_PRIMARY_CLASS =
  "bg-[#48CAE4] text-white hover:bg-cyan-500 shadow-md shadow-cyan-400/30";
const BUTTON_SECONDARY_CLASS =
  "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get real user from context
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Local editable state
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // ← Load real username
      setUserEmail(user.email || "");
    }
  }, [user]);

  // stats
  const [stats, setStats] = useState({
    totalBookmarks: 0,
    favourites: 0,
    archived: 0,
    totalTags: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This uses your existing /api/bookmarks endpoint with filters
        const [allRes, favRes, archRes, tagsRes] = await Promise.all([
          bookmarkService.getAllBookmarks(), // total
          bookmarkService.getAllBookmarks({ favourite: true }),
          bookmarkService.getAllBookmarks({ archived: true }),
          tagService.getAllTags(), // for total tags
        ]);

        setStats({
          totalBookmarks: allRes.total || 0,
          favourites: favRes.total || 0,
          archived: archRes.total || 0,
          totalTags: tagsRes.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
        // Keep defaults or show error toast if you want
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await authService.updateProfile({
        username: username, 
        email: userEmail,
      });
      toast.success("Profile updated successfully!");
      await refreshUser();

      console.log("success");
  
    } catch (err) {
      // toast.error(err.error || "Failed to update profile");
      console.log(err.error);
    } finally {
      console.log("this is finally");
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    toast("Password change coming soon!");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/auth/me");

      toast.success("Account deleted successfully");
      // 🔥 REMOVE AUTH DATA
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔥 NOTIFY NAVBAR (same-tab update)
      window.dispatchEvent(new Event("auth-change"));

      // Redirect after delete
      window.location.href = "/";
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete account");
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const StatCard = ({ icon: Icon, value, label, colorClass }) => (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
      <Icon size={30} strokeWidth={2.5} className={`shrink-0 ${colorClass}`} />
      <div>
        <p className={`text-2xl font-bold ${TEXT_TITLE_CLASS}`}>{value}</p>
        <p className={`text-sm ${TEXT_BODY_CLASS}`}>{label}</p>
      </div>
    </div>
  );

  const SettingsItem = ({
    icon: Icon,
    title,
    description,
    buttonText,
    onClick,
    isDanger = false,
  }) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
      <div className="flex items-center gap-4">
        <Icon
          size={20}
          className={isDanger ? "text-red-500" : PRIMARY_TEXT_CLASS}
        />
        <div>
          <p className={`font-medium ${TEXT_TITLE_CLASS}`}>{title}</p>
          <p className={`text-sm ${TEXT_BODY_CLASS} hidden sm:block`}>
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
          isDanger
            ? "bg-red-600 text-white hover:bg-red-700"
            : BUTTON_SECONDARY_CLASS
        }`}
      >
        {buttonText}
      </button>
    </div>
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Not authenticated
      </div>
    );
  }

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#48CAE4] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
      >
        <Menu size={24} />
      </button>

      <div className="flex min-h-screen bg-[#e9f9fc] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-0"
          } overflow-y-auto shrink-0`}
        >
          <Sidebar />
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </div>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
          <header className="mb-8 flex items-center gap-4">
            <User size={36} strokeWidth={2.5} className={PRIMARY_TEXT_CLASS} />
            <h1
              className={`text-3xl md:text-4xl font-extrabold ${TEXT_TITLE_CLASS}`}
            >
              User Profile & Settings
            </h1>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {/* ACCOUNT DETAILS */}
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b dark:border-slate-700">
                <User size={24} className={PRIMARY_TEXT_CLASS} />
                <h2 className={`text-xl font-bold ${TEXT_TITLE_CLASS}`}>
                  Account Details
                </h2>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#48CAE4] to-cyan-300 flex items-center justify-center text-3xl font-bold text-slate-800 shadow-lg shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${TEXT_TITLE_CLASS}`}>
                    {username}
                  </h3>
                  <p className={`text-base ${TEXT_BODY_CLASS}`}>{userEmail}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${TEXT_BODY_CLASS}`}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className={`absolute left-3 top-2 ${PRIMARY_TEXT_CLASS}`}
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#48CAE4]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${TEXT_BODY_CLASS}`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute left-3 top-2 ${PRIMARY_TEXT_CLASS}`}
                    />
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#48CAE4]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-6 py-2 rounded-lg ${BUTTON_PRIMARY_CLASS} ${
                      saving ? "opacity-70" : ""
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* SECURITY SETTINGS */}
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border">
              <div className="flex items-center gap-4 mb-4 pb-4">
                <Settings size={24} className={PRIMARY_TEXT_CLASS} />
                <h2 className={`text-xl font-bold ${TEXT_TITLE_CLASS}`}>
                  Security & Preferences
                </h2>
              </div>

              <SettingsItem
                icon={Lock}
                title="Change Password"
                description="Update your primary login password."
                buttonText="Update"
                onClick={handlePasswordChange}
              />
            </div>

            {/* USAGE STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Paperclip}
                value={stats.totalBookmarks}
                label="Total Bookmarks"
                colorClass={PRIMARY_TEXT_CLASS}
              />
              <StatCard
                icon={Star}
                value={stats.favourites}
                label="Favourites"
                colorClass="text-yellow-500"
              />
              <StatCard
                icon={Archive}
                value={stats.archived}
                label="Archived"
                colorClass="text-indigo-500"
              />
              <StatCard
                icon={Tag}
                value={stats.totalTags}
                label="Total Tags"
                colorClass="text-pink-500"
              />
            </div>

            {/* DANGER ZONE */}
            <div className="p-6 md:p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 shadow-xl">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <Trash2 size={24} className="text-red-500" />
                  <h2 className="text-xl font-bold text-red-500">
                    Danger Zone
                  </h2>
                </div>

                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg
                 bg-red-600 text-white hover:bg-red-700
                 transition"
                >
                  Delete Account
                </button>
              </div>

              {/* Optional description */}
              <p className="text-sm text-red-600 dark:text-red-400">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </main>
      </div>

      <DeleteUser
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </>
  );
}

export default Profile;
