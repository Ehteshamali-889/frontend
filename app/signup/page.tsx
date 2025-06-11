'use client';

import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../styles/auth.scss';

export default function SignUp() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
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

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
      style: { marginTop: '20px' },
      className: 'custom-toast'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      showToast('success', 'Success', 'Registration successful!');
      
      // Redirect to documents page after a short delay
      setTimeout(() => {
        router.push('/documents');
      }, 1000);
    } catch (error) {
      console.error('Error during registration:', error);
      showToast('error', 'Error', error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} position="top-right" className="custom-toast-container" />
      <style jsx global>{`
        .custom-toast-container {
          .p-toast {
            margin-top: 20px;
            margin-right: 20px;
          }
          .p-toast-message {
            margin-bottom: 10px;
            padding: 1rem;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .p-toast-message-content {
            padding: 0.5rem;
            display: flex;
            align-items: flex-start;
          }
          .p-toast-icon {
            margin-right: 1rem;
            font-size: 1.5rem;
          }
          .p-toast-message-text {
            flex: 1;
          }
          .p-toast-summary {
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .p-toast-detail {
            margin: 0;
          }
        }
      `}</style>
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