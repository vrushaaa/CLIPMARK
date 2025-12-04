import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button, InputField, AuthLayout } from '../components/AuthComponents';
import { Link } from 'react-router-dom';
export default function ForgotPassword({ isDark, toggleTheme, onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Reset Logic Here
    console.log("Sending reset email...");
  };

  return (
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
          placeholder="hello@clipmark.app" 
          icon={Mail} 
          isDark={isDark}
        />

        <Button type="submit">Send Reset Link</Button>

        <Link to="/login" className="font-light"> Back to Login</Link>
      </form>
    </AuthLayout>
  );
}