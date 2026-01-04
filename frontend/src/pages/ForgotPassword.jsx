import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function ForgotPassword({ isDark, toggleTheme }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      toast.success('If the email exists, a reset link has been sent.');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout
        isDark={isDark}
        toggleTheme={toggleTheme}
        title="Reset Password"
        subtitle="We'll send you instructions to reset it."
      >
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="hello@clipmark.app"
            icon={Mail}
            isDark={isDark}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="mt-4 text-center">
            <Link
              to="/auth/login"
              className="font-light text-[#48CAE4] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
