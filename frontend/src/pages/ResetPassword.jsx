import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import Navbar from '../components/NavBar';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function ResetPassword({ isDark, toggleTheme }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      toast.success('Password updated successfully!');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Invalid or expired reset link');
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
        title="Set New Password"
        subtitle="Create a new password for your account."
      >
        <form onSubmit={handleSubmit}>
          <InputField
            label="New Password"
            type="password"
            name="password"
            placeholder="Create a new password"
            icon={Lock}
            isDark={isDark}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
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
