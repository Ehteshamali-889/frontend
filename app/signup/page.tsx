'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Link from 'next/link';
import '../styles/auth.scss';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            <label htmlFor="firstName" className="block mb-2">First Name</label>
            <InputText
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="p-field">
            <label htmlFor="lastName" className="block mb-2">Last Name</label>
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full"
              placeholder="Enter your last name"
              required
            />
          </div>

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
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full"
              placeholder="Enter your password"
              toggleMask
              required
            />
          </div>

          <div className="p-field">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full"
              placeholder="Confirm your password"
              toggleMask
              feedback={false}
              required
            />
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