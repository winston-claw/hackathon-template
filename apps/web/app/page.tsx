'use client';

import { useState } from 'react';
import Link from 'next/link';

const SLIDES = [
  { icon: '✦', title: 'Your\nHeadline\nGoes Here', badge: '⚡' },
  { icon: '◎', title: 'Discover\nSomething\nNew', badge: '🔍' },
  { icon: '△', title: 'Built For\nWhat Matters\nTo You', badge: '♡' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a1a' }}>
      {/* Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(245, 245, 240, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ddd8d0',
      }}>
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
            <span style={{
              display: 'inline-flex',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#2d2d2d',
              color: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              marginRight: 8,
              verticalAlign: 'middle',
            }}>Y</span>
            YourApp
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#features" style={{ color: '#888', fontWeight: 500, textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ color: '#888', fontWeight: 500, textDecoration: 'none' }}>Pricing</a>
            <Link href="/login" style={{ color: '#888', fontWeight: 500, textDecoration: 'none' }}>Log In</Link>
            <Link href="/signup" style={{
              padding: '0.55rem 1.1rem',
              background: '#2d2d2d',
              color: '#fff',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', alignItems: 'center', gap: '2.5rem' }}>
          <div>
            <p style={{
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: '#888',
              marginBottom: '0.9rem',
            }}>
              Swipe to discover more
            </p>
            <h1 style={{
              fontSize: 'clamp(2.1rem, 4.2vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -0.5,
              marginBottom: '1rem',
            }}>
              Built for what matters to you.
            </h1>
            <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '56ch', marginBottom: '1.7rem', lineHeight: 1.6 }}>
              Sign up to get started with your journey. Discover something new, track your progress,
              and see results from day one.
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', marginBottom: '1.4rem', flexWrap: 'wrap' as const }}>
              <Link href="/signup" style={{
                padding: '0.75rem 1.5rem',
                background: '#2d2d2d',
                color: '#fff',
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Get Started
              </Link>
              <a href="#features" style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#1a1a1a',
                borderRadius: 999,
                fontWeight: 600,
                border: '1px solid #ddd8d0',
                textDecoration: 'none',
              }}>
                Learn more
              </a>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', color: '#888', fontSize: '0.92rem', flexWrap: 'wrap' as const }}>
              <span><strong style={{ color: '#1a1a1a' }}>4.9/5</strong> average rating</span>
              <span><strong style={{ color: '#1a1a1a' }}>10K+</strong> active users</span>
              <span><strong style={{ color: '#1a1a1a' }}>99%</strong> uptime</span>
            </div>
          </div>

          {/* Phone mockup mirroring the mobile onboarding */}
          <div style={{
            border: '1px solid #ddd8d0',
            borderRadius: 24,
            background: '#fff',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            padding: '1.5rem',
            maxWidth: 360,
            justifySelf: 'center',
          }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: '#eae8e3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              color: '#aaa69e',
              position: 'relative' as const,
              marginBottom: 20,
            }}>
              {SLIDES[activeSlide].icon}
              <span style={{
                position: 'absolute' as const,
                bottom: 2,
                right: -6,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #ddd8d0',
              }}>
                {SLIDES[activeSlide].badge}
              </span>
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -0.3,
              marginBottom: 20,
              whiteSpace: 'pre-line' as const,
            }}>
              {SLIDES[activeSlide].title}
            </h2>

            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: i === activeSlide ? '#1a1a1a' : '#d4d4d0',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            <Link href="/signup" style={{
              display: 'block',
              width: '100%',
              padding: '0.9rem',
              borderRadius: 999,
              background: '#2d2d2d',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              textAlign: 'center' as const,
              textDecoration: 'none',
              marginBottom: 10,
            }}>
              Get Started
            </Link>
            <p style={{ textAlign: 'center' as const, color: '#888', fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'none' }}>
                Log In
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '4.5rem 1.5rem', maxWidth: 1120, margin: '0 auto' }}>
        <p style={{
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: '#888',
          marginBottom: '0.5rem',
        }}>
          Why YourApp
        </p>
        <h2 style={{ fontSize: 'clamp(1.7rem, 3.3vw, 2.5rem)', fontWeight: 700, letterSpacing: -0.3, marginBottom: '2rem' }}>
          Everything you need in one place.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { title: 'Feature one', desc: 'Describe the first key feature of your product and the problem it solves for users.' },
            { title: 'Feature two', desc: 'Describe the second key feature and why it matters to your target audience.' },
            { title: 'Feature three', desc: 'Describe the third key feature and how it differentiates you from alternatives.' },
            { title: 'Feature four', desc: 'Describe another feature that adds value and keeps users coming back.' },
            { title: 'Feature five', desc: 'Describe a feature related to trust, security, or reliability that users care about.' },
            { title: 'Feature six', desc: 'Describe a final feature that rounds out your product offering.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '1.2rem',
              border: '1px solid #ddd8d0',
              borderRadius: 16,
              background: '#fff',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#888', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        padding: '4.5rem 1.5rem',
        background: '#fafaf6',
        borderTop: '1px solid #ddd8d0',
        borderBottom: '1px solid #ddd8d0',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: '#888',
            marginBottom: '0.5rem',
          }}>
            Pricing
          </p>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.3vw, 2.5rem)', fontWeight: 700, letterSpacing: -0.3, marginBottom: '2rem' }}>
            Simple, transparent pricing.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {[
              {
                name: 'Starter',
                price: '$0',
                label: 'Forever free',
                features: ['Core features', 'Up to 3 projects', 'Community support'],
                featured: false,
              },
              {
                name: 'Pro',
                price: '$12',
                label: 'Per user / month',
                features: ['Unlimited projects', 'Advanced features', 'Integrations', 'Priority support'],
                featured: true,
              },
              {
                name: 'Teams',
                price: '$49',
                label: 'Per team / month',
                features: ['Everything in Pro', 'Admin dashboard', 'Team management', 'Dedicated support'],
                featured: false,
              },
            ].map((plan, i) => (
              <div key={i} style={{
                padding: '1.35rem',
                border: `1px solid ${plan.featured ? '#1a1a1a' : '#ddd8d0'}`,
                borderRadius: 16,
                background: plan.featured ? '#1a1a1a' : '#fff',
                color: plan.featured ? '#fff' : '#1a1a1a',
              }}>
                {plan.featured && (
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.77rem',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.07em',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#fff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 999,
                    marginBottom: '0.8rem',
                  }}>
                    Most popular
                  </span>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 0.1rem' }}>{plan.price}</p>
                <p style={{ color: plan.featured ? '#d4d4d0' : '#888', fontSize: '0.9rem' }}>{plan.label}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 1.3rem', display: 'grid', gap: '0.55rem' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ color: plan.featured ? '#d4d4d0' : '#888' }}>
                      <span style={{ color: plan.featured ? '#8fd4b8' : '#2d8a6e' }}>✓ </span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 999,
                  background: plan.featured ? '#fff' : '#2d2d2d',
                  color: plan.featured ? '#1a1a1a' : '#fff',
                  fontWeight: 600,
                  textAlign: 'center' as const,
                  textDecoration: 'none',
                  border: plan.featured ? 'none' : '1px solid transparent',
                }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          border: '1px solid #ddd8d0',
          borderRadius: 20,
          background: '#eae8e3',
          padding: '2rem',
        }}>
          <p style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: '#888',
            marginBottom: '0.5rem',
          }}>
            Ready to get started?
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: -0.3, marginBottom: '0.5rem' }}>
            Sign up to get started with your journey.
          </h2>
          <p style={{ color: '#888', marginBottom: '1.2rem' }}>No credit card required. Cancel anytime.</p>

          {subscribed ? (
            <p style={{ color: '#2d8a6e', fontWeight: 500 }}>Thanks! You are on the list.</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' as const }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  flex: '1 1 220px',
                  minHeight: 44,
                  borderRadius: 999,
                  border: '1px solid #ddd8d0',
                  background: '#fff',
                  color: '#1a1a1a',
                  padding: '0 1rem',
                  fontSize: '1rem',
                }}
              />
              <button type="submit" style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 999,
                background: '#2d2d2d',
                color: '#fff',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}>
                Get Started
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #ddd8d0',
        padding: '2rem 1.5rem 1.4rem',
        background: '#fafaf6',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.4rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #ddd8d0',
          }}>
            <div>
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
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}>Y</span>
                YourApp
              </span>
              <p style={{ color: '#888', marginTop: 8, fontSize: '0.95rem' }}>Built for what matters to you.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: 'block', color: '#888', fontSize: '0.95rem', marginBottom: 4, textDecoration: 'none' }}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} YourApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
