'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oauthNotice, setOauthNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const nameIsValid = name.trim().length >= 2;
  const emailIsValid = EMAIL_REGEX.test(email.trim());
  const passwordIsValid = password.length >= 6;
  const canSubmit = nameIsValid && emailIsValid && passwordIsValid && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOauthNotice('');
    setTouched({ name: true, email: true, password: true });

    if (!nameIsValid) { setError('Enter your full name (at least 2 characters).'); return; }
    if (!emailIsValid) { setError('Enter a valid email address.'); return; }
    if (!passwordIsValid) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    border: `1px solid ${hasError ? '#e57373' : '#ddd8d0'}`,
    borderRadius: 14,
    padding: '14px 16px',
    background: '#fff',
    color: '#1a1a1a',
    fontSize: 16,
    boxSizing: 'border-box' as const,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '2rem',
      }}>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: '#eae8e3',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#1a1a1a',
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          ←
        </button>

        <h1 style={{
          fontSize: 36,
          lineHeight: '42px',
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: -0.5,
          marginBottom: 10,
        }}>
          Create<br />account
        </h1>
        <p style={{ fontSize: 15, lineHeight: '22px', color: '#888', marginBottom: 28 }}>
          Sign up to get started with your journey.
        </p>

        {error && (
          <div style={{
            padding: 14,
            borderRadius: 14,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 14, color: '#b91c1c', margin: 0 }}>{error}</p>
          </div>
        )}

        {oauthNotice && (
          <div style={{
            padding: 14,
            borderRadius: 14,
            background: '#f0f0eb',
            border: '1px solid #ddd8d0',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, color: '#555', margin: 0 }}>{oauthNotice}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', color: '#1a1a1a', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            placeholder="Alex Johnson"
            style={inputStyle(touched.name && !nameIsValid)}
          />
          {touched.name && !nameIsValid && (
            <p style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>Name should be at least 2 characters.</p>
          )}

          <label style={{ display: 'block', color: '#1a1a1a', fontSize: 13, fontWeight: 600, marginBottom: 8, marginTop: 14 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart())}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="you@example.com"
            style={inputStyle(touched.email && !emailIsValid)}
          />
          {touched.email && !emailIsValid && (
            <p style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>Use a valid email format.</p>
          )}

          <label style={{ display: 'block', color: '#1a1a1a', fontSize: 13, fontWeight: 600, marginBottom: 8, marginTop: 14 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            placeholder="••••••••"
            style={inputStyle(touched.password && !passwordIsValid)}
          />
          <p style={{ color: '#999', fontSize: 12, marginTop: 6 }}>Minimum 6 characters.</p>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '17px',
              borderRadius: 30,
              background: canSubmit ? '#2d2d2d' : '#b5b5b0',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              marginTop: 24,
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{ marginTop: 22, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: '#ddd8d0' }} />
            <span style={{ color: '#999', fontSize: 12, fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#ddd8d0' }} />
          </div>

          {/* OAuth */}
          <Link
            href="/auth/google"
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              borderRadius: 30,
              border: '1px solid #ddd8d0',
              background: '#fff',
              color: '#1a1a1a',
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center' as const,
              textDecoration: 'none',
              marginTop: 10,
              boxSizing: 'border-box' as const,
            }}
          >
            Sign up with Google
          </Link>

          <Link
            href="/auth/apple"
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              borderRadius: 30,
              background: '#1a1a1a',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center' as const,
              textDecoration: 'none',
              marginTop: 10,
              border: 'none',
              boxSizing: 'border-box' as const,
            }}
          >
            Sign up with Apple
          </Link>
        </form>

        <p style={{ marginTop: 28, color: '#888', fontSize: 14, textAlign: 'center' as const }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
