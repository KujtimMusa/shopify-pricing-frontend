/**
 * Modern Sidebar Component
 * Inspired by Linear, Notion, Vercel
 * State-of-the-art design with inline styles
 */
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useShop } from '@/hooks/useShop';
import { 
  LayoutDashboard, 
  Package, 
  Lightbulb, 
  Settings,
  CheckCircle2,
  AlertTriangle,
  Store
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { shops, currentShop, isDemoMode, switchToShop } = useShop();
  const [activeTab, setActiveTab] = React.useState<'live' | 'demo'>(
    isDemoMode ? 'demo' : 'live'
  );

  const demoShop = shops.find(s => s.type === 'demo');
  const liveShops = shops.filter(s => s.type === 'shopify' && s.id !== 999);

  const handleTabSwitch = async (tab: 'live' | 'demo') => {
    setActiveTab(tab);
    if (tab === 'demo' && demoShop) {
      await switchToShop(demoShop.id, true);
    } else if (tab === 'live' && liveShops.length > 0) {
      await switchToShop(liveShops[0].id, false);
    }
  };

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      emoji: '📊'
    },
    { 
      href: '/products', 
      label: 'Produkte', 
      icon: Package,
      emoji: '📦'
    },
    { 
      href: '/recommendations', 
      label: 'Empfehlungen', 
      icon: Lightbulb,
      emoji: '💡'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Sidebar Container Styles
  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#0f172a',
    borderRight: '1px solid #1e293b',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    zIndex: 1000,
  };

  // Scrollbar Styles (via CSS-in-JS)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      aside::-webkit-scrollbar {
        width: 6px;
      }
      aside::-webkit-scrollbar-track {
        background: transparent;
      }
      aside::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 3px;
      }
      aside::-webkit-scrollbar-thumb:hover {
        background: #475569;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <aside style={sidebarStyle} className={className}>
      {/* A) LOGO SECTION */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #1e293b',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 700,
        }}>
          P
        </div>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#f1f5f9',
          background: 'transparent',
          border: 'none',
          margin: 0,
          padding: 0,
        }}>
          PriceIQ
        </span>
      </div>

      {/* B) SHOP SELECTOR */}
      <div style={{
        padding: '16px 20px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid #1e293b',
      }}>
        {/* Label */}
        <span style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#64748b',
          marginBottom: '12px',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}>
          Aktiver Shop
        </span>

        {/* Live/Demo Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          background: '#1e293b',
          padding: '4px',
          borderRadius: '8px',
          border: 'none',
        }}>
          <button
            onClick={() => handleTabSwitch('live')}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: activeTab === 'live' ? '#334155' : 'transparent',
              color: activeTab === 'live' ? '#f1f5f9' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'live') {
                e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
                e.currentTarget.style.color = '#cbd5e1';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'live') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            Live
          </button>
          <button
            onClick={() => handleTabSwitch('demo')}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: activeTab === 'demo' ? '#334155' : 'transparent',
              color: activeTab === 'demo' ? '#f1f5f9' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'demo') {
                e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
                e.currentTarget.style.color = '#cbd5e1';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'demo') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            Demo
          </button>
        </div>

        {/* Shop Card */}
        {currentShop && (
          <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            margin: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#334155';
            e.currentTarget.style.borderColor = '#475569';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.borderColor = '#334155';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            {/* Shop Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: 'none',
              padding: 0,
            }}>
              <Store size={24} color="white" />
            </div>

            {/* Shop Info - HORIZONTAL TEXT */}
            <div style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'flex-start',
              writingMode: 'horizontal-tb',
              transform: 'none',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '2px',
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  writingMode: 'horizontal-tb',
                  transform: 'none',
                  display: 'block',
                }}>
                  {currentShop.name}
                </span>
                {!isDemoMode && (
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    Aktiv ✓
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '12px',
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
                writingMode: 'horizontal-tb',
                transform: 'none',
                display: 'block',
              }}>
                {currentShop.product_count || 20} Produkte • 90 Tage Verlauf
              </span>
            </div>
          </div>
        )}

        {/* Demo Warning Box */}
        {isDemoMode && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#f1f5f9',
              }}>
                Demo-Modus Aktiv
              </span>
              <span style={{
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: 1.5,
              }}>
                Du testest mit synthetischen Daten. Verbinde deinen echten Shopify-Shop für Live-Daten.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* C) NAVIGATION */}
      <nav style={{
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: 1,
      }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${active ? '#3b82f6' : 'transparent'}`,
                borderRadius: '8px',
                color: active ? '#60a5fa' : '#94a3b8',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                margin: 0,
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.borderLeftColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }
              }}
            >
              <Icon 
                size={20} 
                color={active ? '#60a5fa' : '#94a3b8'}
                style={{ flexShrink: 0 }}
              />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* D) FOOTER */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
        padding: '16px 12px',
        background: 'transparent',
      }}>
        <a
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            borderLeft: '2px solid transparent',
            borderRadius: '8px',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            margin: 0,
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.color = '#cbd5e1';
            e.currentTarget.style.borderLeftColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderLeftColor = 'transparent';
          }}
        >
          <Settings size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
          <span>Einstellungen</span>
        </a>
      </div>
    </aside>
  );
}

