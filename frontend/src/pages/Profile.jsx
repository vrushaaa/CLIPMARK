import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Settings, BarChart2, Trash2, Moon, Sun, Paperclip, Star, Archive } from "lucide-react";

// --- Theme and Color Constants ---
const PRIMARY_COLOR = '#48CAE4';
const PRIMARY_TEXT_CLASS = 'text-[#48CAE4]';
const BG_MAIN_CLASS = 'bg-slate-50 dark:bg-slate-900';
const TEXT_TITLE_CLASS = 'text-slate-900 dark:text-white';
const TEXT_BODY_CLASS = 'text-slate-600 dark:text-slate-400';
const BUTTON_PRIMARY_CLASS = 'bg-[#48CAE4] text-white hover:bg-cyan-500 shadow-md shadow-cyan-400/30';
const BUTTON_SECONDARY_CLASS = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600';


// --- Profile Page Component ---
function Profile() {
    // Mock User Data and Stats
    const [userName, setUserName] = useState("Jane Doe");
    const [userEmail, setUserEmail] = useState("jane.doe@clipmark.com");
    const mockStats = {
        totalBookmarks: 187,
        favourites: 24,
        archived: 59,
        lastActivity: "2 days ago",
    };

    const handleUpdateProfile = () => {
        // Mock function for update logic
        console.log(`Updating profile for ${userName} (${userEmail})`);
    };

    const handlePasswordChange = () => {
        console.log("Initiating password change workflow...");
    };

    const handleDeleteAccount = () => {
        // Implement modal confirmation here instead of alert()
        console.warn("Initiating account deletion process...");
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

    const SettingsItem = ({ icon: Icon, title, description, buttonText, onClick, isDanger = false }) => (
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
            <div className="flex items-center gap-4">
                <Icon size={20} className={isDanger ? 'text-red-500' : PRIMARY_TEXT_CLASS} />
                <div>
                    <p className={`font-medium ${TEXT_TITLE_CLASS}`}>{title}</p>
                    <p className={`text-sm ${TEXT_BODY_CLASS} hidden sm:block`}>{description}</p>
                </div>
            </div>
            <button 
                onClick={onClick} 
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${isDanger ? 'bg-red-600 text-white hover:bg-red-700' : BUTTON_SECONDARY_CLASS}`}
            >
                {buttonText}
            </button>
        </div>
    );

    return (
        <div className={`min-h-screen ${BG_MAIN_CLASS} transition-colors duration-500 flex flex-col font-sans`}>

            <div className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12 w-full">
                
                {/* Header Section */}
                <header className="mb-8 flex items-center gap-4">
                    <User size={36} strokeWidth={2.5} className={PRIMARY_TEXT_CLASS} />
                    <h1 className={`text-3xl md:text-4xl font-extrabold ${TEXT_TITLE_CLASS}`}>
                        User Profile & Settings
                    </h1>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    
                    {/* 1. Account Details Card */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b dark:border-slate-700">
                             <User size={24} className={PRIMARY_TEXT_CLASS} />
                            <h2 className={`text-xl font-bold ${TEXT_TITLE_CLASS}`}>Account Details</h2>
                        </div>
                        
                        {/* Profile Picture & User Info */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#48CAE4] to-cyan-300 flex items-center justify-center text-3xl font-bold text-slate-800 shadow-lg shrink-0">
                                J
                            </div>
                            <div>
                                <h3 className={`text-2xl font-semibold ${TEXT_TITLE_CLASS}`}>{userName}</h3>
                                <p className={`text-base ${TEXT_BODY_CLASS}`}>{userEmail}</p>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-4">
                            <div>
                                <label htmlFor="name" className={`block text-sm font-medium mb-1 ${TEXT_BODY_CLASS}`}>Full Name</label>
                                <div className="flex items-center relative">
                                    <User size={18} className={`absolute left-3 ${PRIMARY_TEXT_CLASS}`} />
                                    <input 
                                        type="text" 
                                        id="name" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] transition duration-150"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${TEXT_BODY_CLASS}`}>Email Address</label>
                                <div className="flex items-center relative">
                                    <Mail size={18} className={`absolute left-3 ${PRIMARY_TEXT_CLASS}`} />
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] transition duration-150"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${BUTTON_PRIMARY_CLASS}`}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Security & Preferences Card */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
                             <Settings size={24} className={PRIMARY_TEXT_CLASS} />
                            <h2 className={`text-xl font-bold ${TEXT_TITLE_CLASS}`}>Security & Preferences</h2>
                        </div>
                        
                        <div className="space-y-2">
                            <SettingsItem
                                icon={Lock}
                                title="Change Password"
                                description="Update your primary login password to secure your account."
                                buttonText="Update"
                                onClick={handlePasswordChange}
                            />
                        </div>
                    </div>

                    {/* 3. Usage Statistics */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
                             <BarChart2 size={24} className={PRIMARY_TEXT_CLASS} />
                            <h2 className={`text-xl font-bold ${TEXT_TITLE_CLASS}`}>Your ClipMark Usage</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard 
                                icon={Paperclip} 
                                value={mockStats.totalBookmarks} 
                                label="Total Bookmarks"
                                colorClass={PRIMARY_TEXT_CLASS}
                            />
                            <StatCard 
                                icon={Star} 
                                value={mockStats.favourites} 
                                label="Favourites"
                                colorClass="text-yellow-500"
                            />
                            <StatCard 
                                icon={Archive} 
                                value={mockStats.archived} 
                                label="In Archive"
                                colorClass="text-indigo-500"
                            />
                            <StatCard 
                                icon={Settings} 
                                value={mockStats.lastActivity} 
                                label="Last Active"
                                colorClass="text-green-500"
                            />
                        </div>
                    </div>

                    {/* 4. Danger Zone */}
                    <div className="p-6 md:p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-xl">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-red-200 dark:border-red-700">
                             <Trash2 size={24} className="text-red-500" />
                            <h2 className={`text-xl font-bold text-red-500`}>Danger Zone</h2>
                        </div>
                        
                        <SettingsItem
                            icon={Trash2}
                            title="Delete Account"
                            description="Permanently erase your account and all associated bookmarks. This action cannot be undone."
                            buttonText="Delete Account"
                            onClick={handleDeleteAccount}
                            isDanger={true}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Profile;