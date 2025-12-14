import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

export default function Signup({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success('Account created successfully! Please login.');
      navigate('/auth/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      await authService.googleLogin({
        token: tokenResponse.access_token,
      });
      localStorage.setItem("token", tokenResponse.access_token);
      toast.success('Logged in with Google!');
      console.log(tokenResponse);
      navigate('/api/dashboard');
    } catch (err) {
      toast.error('Google login failed');
    }
  },
  onError: () => toast.error('Google login failed'),
});


  return (
    <>
      <Navbar />
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
            name="fullName"
            placeholder="John Doe" 
            // value={formData.fullName}
            onChange={handleChange}
            icon={User} 
            isDark={isDark}
            required
          />
          <InputField 
            label="User Name" 
            type="text" 
            name="username"
            placeholder="JohnDoe_21" 
            // value={formData.fullName}
            onChange={handleChange}
            icon={User} 
            isDark={isDark}
            required
          />
          <InputField 
            label="Email Address" 
            type="email" 
            name="email"
            placeholder="hello@clipmark.app" 
            // value={formData.email}
            onChange={handleChange}
            icon={Mail} 
            isDark={isDark}
            required
          />
          <InputField 
            label="Password" 
            type="password" 
            name="password"
            placeholder="Create a password" 
            // value={formData.password}
            onChange={handleChange}
            icon={Lock} 
            isDark={isDark}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <button type="button"
            onClick={() => googleLogin()}
            className="mt-6 w-full flex items-center justify-center gap-3
                      border border-slate-300 dark:border-slate-700
                      rounded-lg py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Signup with Google</span>
          </button>

          <p className={`text-sm mt-4 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-[#48CAE4] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}