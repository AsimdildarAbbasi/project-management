import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await login(formData);
      const userRole = response?.user?.role || 'user';
      if (userRole === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/my-tasks', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.response?.data?.error || 'Invalid email or password';
      const code = err.response?.data?.code || null;
      setServerError({ message, code });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to Dispatch"
      subtitle="Enter your station credentials to access your dispatch ticket ledger."
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-body" noValidate>
        {/* Top-of-form Server Error Banner */}
        {serverError && (
          <div className="bg-rust/10 border border-rust text-rust p-3 rounded-xs text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {serverError.code && (
                <span className="font-mono font-bold block uppercase tracking-wider text-[10px]">
                  ERROR CODE: [{serverError.code}]
                </span>
              )}
              <p className="font-medium">{serverError.message}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder="e.g. operator@dispatch.internal"
          disabled={submitting}
          autoComplete="email"
          required
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          placeholder="••••••••••••"
          disabled={submitting}
          autoComplete="current-password"
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brass" />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Redirect Link */}
        <div className="text-center pt-2 border-t border-slate/20">
          <p className="text-xs text-slate">
            New here?{' '}
            <Link
              to="/register"
              className="font-semibold text-ink hover:text-brass underline decoration-brass/50 underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
