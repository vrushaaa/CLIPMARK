import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';


export default function Login({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    // console.log("EVENT NAME:", e.target.name);
    // console.log("EVENT VALUE:", e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("EVENT NAME:", e.target.name);
    console.log("EVENT VALUE:", e.target.value);
    try {
      const response = await authService.login(formData);
      toast.success('Welcome back!');
      console.log("login succesfull")
      console.log(response)
      localStorage.setItem("token", response.token);

      navigate('/api/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.error || 'Login failed. Please try again.');
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
        title="Welcome Back"
        subtitle="Please enter your details to sign in."
      >
        <form onSubmit={handleSubmit}>
          <InputField 
            label="Username" 
            type="text" 
            name="username"
            placeholder="Username" 
            value={formData.username}
            onChange={handleChange}
            icon={Mail} 
            isDark={isDark}
            required
          />
          <InputField 
            label="Password" 
            type="password" 
            name="password"
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange}
            icon={Lock} 
            isDark={isDark}
            required
          />

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-600 text-[#48CAE4] focus:ring-[#48CAE4] accent-[#48CAE4]" 
              />
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Remember me
              </span>
            </label>
            <Link to="/auth/forgot" className="font-bold text-[#48CAE4] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
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
          <span>Continue with Google</span>
        </button>

          <p className={`text-sm mt-4 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Don't have an account?{' '}
            <Link to="/auth/signup" className="font-bold text-[#48CAE4] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
