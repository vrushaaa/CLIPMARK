import React from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';

export default function Signup({ isDark, toggleTheme, onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Signup Logic Here
    console.log("Signing up...");
  };

  return (
    <AuthLayout 
      isDark={isDark} 
      toggleTheme={toggleTheme}
      title="Create Account"
      subtitle="Start clipping and marking today."
    >
      <form onSubmit={handleSubmit}>
        <InputField 
          label="Full Name" 
          type="text" 
          placeholder="John Doe" 
          icon={User} 
          isDark={isDark}
        />
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
          placeholder="Create a password" 
          icon={Lock} 
          isDark={isDark}
        />

        <Button type="submit">Create Account</Button>

        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Already have an account?{' '}
          {/* <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#48CAE4] font-bold hover:underline"
          >
            Log in
          </button> */}
          <Link to="/login" className="font-bold">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}