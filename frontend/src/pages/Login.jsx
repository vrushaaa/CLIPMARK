import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';

export default function Login({ isDark, toggleTheme, onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Login Logic Here
    console.log("Logging in...");
  };

  return (
    <AuthLayout 
      isDark={isDark} 
      toggleTheme={toggleTheme}
      title="Welcome Back"
      subtitle="Please enter your details to sign in."
    >
      <form onSubmit={handleSubmit}>
        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="hello@clipmark.app" 
          icon={Mail} 
          isDark={isDark}
        />
        <InputField 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          icon={Lock} 
          isDark={isDark}
        />

        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-[#48CAE4] focus:ring-[#48CAE4] accent-[#48CAE4]" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Remember me</span>
          </label>
          <Link to="/forgot" className="font-bold">Forgot Password?</Link>
        </div>

        <Button type="submit">Sign In</Button>

        {/* <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-[#48CAE4] font-bold hover:underline"
          >
            Sign up
          </button>
        </p> */}
        <Link to="/signup" className="font-bold">Signup</Link>
      </form>
    </AuthLayout>
  );
}