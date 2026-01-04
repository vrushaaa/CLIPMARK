import React, { useState } from 'react';
import { Moon, Sun, Paperclip, Eye, EyeOff } from 'lucide-react';

// --- Button Component ---
export const Button = ({ children, onClick, type = "button", isLoading = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading}
    className="w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform active:scale-[0.98] 
      disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20
      bg-[#48CAE4] text-slate-900 hover:brightness-110 mb-6"
  >
    {isLoading ? (
      <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </button>
);

// --- Input Component ---
export const InputField = ({ label, type = "text", name, placeholder, icon: Icon, value, onChange, isDark }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div className="mb-5 relative group text-left">
      <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {label}
      </label>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-slate-500 group-focus-within:text-[#48CAE4]' : 'text-slate-400 group-focus-within:text-[#48CAE4]'}`}>
          <Icon size={20} />
        </div>
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}                 // ← REQUIRED
          value={value}               // ← REQUIRED
          onChange={onChange}         // ← REQUIRED
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 outline-none transition-all duration-300
            ${isDark 
              ? 'bg-slate-800/50 border-slate-700 text-white focus:border-[#48CAE4] placeholder-slate-600' 
              : 'bg-white border-slate-200 text-slate-900 focus:border-[#48CAE4] placeholder-slate-400'
            } focus:ring-4 focus:ring-[#48CAE4]/10`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[#48CAE4] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Logo Component ---
export const Logo = ({ isDark }) => (
  <div className="flex items-center gap-2 mb-2 justify-center">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#48CAE4] to-cyan-300 flex items-center justify-center text-slate-900 shadow-lg shadow-[#48CAE4]/20">
      <Paperclip size={24} strokeWidth={2.5} className="transform -rotate-45" />
    </div>
    <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
      Clipmark
    </span>
  </div>
);

// --- Layout Wrapper (Background & Card) ---
export const AuthLayout = ({ children, isDark, toggleTheme, title, subtitle }) => {
  return (
    <div className={'min-h-screen w-full transition-colors duration-500 relative flex items-center justify-center p-4 dark:bg-slate-900 dark:text-slate-100 bg-slate-50 text-slate-800'}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 bg-[#48CAE4]`} />
        <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-purple-500`} />
      </div>

      {/* Theme Toggle */}
      {/* <button 
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 z-50
          ${isDark 
            ? 'bg-slate-800 text-[#48CAE4] hover:bg-slate-700' 
            : 'bg-white text-slate-600 hover:bg-slate-100 shadow-md'}`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button> */}

      {/* Main Card */}
      <div className="w-full max-w-[420px] relative z-10">
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-opacity-50 text-center
          ${isDark 
            ? 'bg-slate-900/60 border-slate-700 shadow-black/50' 
            : 'bg-white/70 border-white/50 shadow-slate-200/50'}`}>
          
          <Logo isDark={isDark} />
          <h2 className="text-xl font-semibold mt-4">{title}</h2>
          <p className={`text-sm mt-2 mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {subtitle}
          </p>

          {children}
          
        </div>
        <p className={`text-center text-xs mt-8 opacity-50 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          &copy; {new Date().getFullYear()} Clipmark. All rights reserved.
        </p>
      </div>
    </div>
  );
};