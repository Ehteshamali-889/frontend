'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Link from 'next/link';
import '../styles/auth.scss';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up:', formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Please fill in your details to sign up</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="p-field">
            <label htmlFor="email" className="block mb-2">Email</label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="p-field">
            <label htmlFor="password" className="block mb-2">Password</label>
            <div className="custom-password-field">
              <InputText
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button type="submit" label="Sign Up" className="p-button-primary" />
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 