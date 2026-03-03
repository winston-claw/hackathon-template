'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1a1a1a',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1a1a1a',
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #ddd8d0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          <span style={{
            display: 'inline-flex',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#2d2d2d',
            color: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            marginRight: 8,
            verticalAlign: 'middle',
          }}>Y</span>
          Dashboard
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#888' }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#1a1a1a',
              border: '1px solid #ddd8d0',
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '2rem', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: -0.3 }}>
            Welcome back{user.name ? `, ${user.name}` : ''}
          </h2>
          <p style={{ color: '#888' }}>
            This is your authenticated dashboard. Only logged-in users can see this page.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {[
            { label: 'Total Users', value: '1,234', change: '+12%' },
            { label: 'Revenue', value: '$12,345', change: '+8%' },
            { label: 'Active Sessions', value: '567', change: '+23%' },
            { label: 'Conversion', value: '3.2%', change: '+5%' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff',
              padding: '1.25rem',
              borderRadius: 16,
              border: '1px solid #ddd8d0',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>
                {stat.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#2d8a6e', fontWeight: 600 }}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: 16,
          border: '1px solid #ddd8d0',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
            <button style={{
              padding: '0.75rem 1.25rem',
              background: '#2d2d2d',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              Create New Project
            </button>
            <button style={{
              padding: '0.75rem 1.25rem',
              background: '#fff',
              color: '#1a1a1a',
              border: '1px solid #ddd8d0',
              borderRadius: 999,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              View Analytics
            </button>
            <button style={{
              padding: '0.75rem 1.25rem',
              background: '#fff',
              color: '#1a1a1a',
              border: '1px solid #ddd8d0',
              borderRadius: 999,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
              Invite Team Member
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
