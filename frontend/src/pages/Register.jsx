import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, User, ShieldCheck, Check } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
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

  const setRole = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      const response = await register(formData);
      const userRole = response?.user?.role || formData.role;
      if (userRole === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/my-tasks', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      const code = err.response?.data?.code || null;
      setServerError({ message, code });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Register Station Account"
      subtitle="Create your user or administrator account to start managing dispatch stubs."
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

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name}
          placeholder="e.g. Asim Abbasi"
          disabled={submitting}
          autoComplete="name"
          required
        />

        {/* Email Address */}
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

        {/* Password */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          placeholder="At least 6 characters"
          disabled={submitting}
          autoComplete="new-password"
          required
        />

        {/* Side-by-Side Role Selection Cards (NOT a dropdown) */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate">
            Account Role & Station Privileges
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* User Role Card */}
            <div
              onClick={() => !submitting && setRole('user')}
              className={`
                relative p-3 rounded-xs border cursor-pointer select-none transition-all duration-150 space-y-1.5
                ${
                  formData.role === 'user'
                    ? 'bg-paper-2 border-brass shadow-xs text-ink'
                    : 'bg-paper border-slate/30 text-slate hover:border-slate/60 hover:text-ink'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-ink">
                  <User className="w-3.5 h-3.5 text-slate" /> Member
                </span>
                {formData.role === 'user' && (
                  <span className="w-4 h-4 rounded-full bg-brass text-paper flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] font-body leading-snug">
                Assigned tasks, file attachments, and discussion comments.
              </p>
            </div>

            {/* Admin Role Card */}
            <div
              onClick={() => !submitting && setRole('admin')}
              className={`
                relative p-3 rounded-xs border cursor-pointer select-none transition-all duration-150 space-y-1.5
                ${
                  formData.role === 'admin'
                    ? 'bg-paper-2 border-brass shadow-xs text-ink'
                    : 'bg-paper border-slate/30 text-slate hover:border-slate/60 hover:text-ink'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-ink">
                  <ShieldCheck className="w-3.5 h-3.5 text-brass" /> Admin
                </span>
                {formData.role === 'admin' && (
                  <span className="w-4 h-4 rounded-full bg-brass text-paper flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] font-body leading-snug">
                Full control over tasks, file management, and team roles.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brass" />
              <span>Registering...</span>
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Redirect Link */}
        <div className="text-center pt-2 border-t border-slate/20">
          <p className="text-xs text-slate">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-ink hover:text-brass underline decoration-brass/50 underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
