"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { signOut, useSession } from 'next-auth/react';

import Image from 'next/image';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Track if we are on mobile/tablet
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const isLoginPage = pathname?.startsWith('/admin/login');

  // Handle Resize to auto-close sidebar on mobile or set correct state
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        if (window.innerWidth < 768) {
          setSidebarOpen(false); // Default close on very small screens
        }
      } else {
        setIsMobile(false);
        setSidebarOpen(true); // Default open on desktop
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change if on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Nuclear option: Force override any lingering display: none styles
  React.useEffect(() => {
    if (!isLoginPage) {
      const sidebar = document.querySelector('.admin-sidebar') as HTMLElement;
      if (sidebar) {
        sidebar.style.display = 'flex';
        sidebar.style.removeProperty('display');
      }
    }
  }, [pathname, isLoginPage]);

  const menuItems = [
    { name: 'Dashboard', icon: 'fa-chart-pie', href: '/admin' },
    { name: 'Teachers', icon: 'fa-chalkboard-teacher', href: '/admin/teachers' },
    { name: 'Gallery', icon: 'fa-images', href: '/admin/gallery' },
    { name: 'Notices', icon: 'fa-bullhorn', href: '/admin/notices' },
    { name: 'Certificates', icon: 'fa-certificate', href: '/admin/certificate' },
    { name: 'Settings', icon: 'fa-cog', href: '/admin/settings' },
  ];

  return (
    <div className="admin-container">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && !isLoginPage && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Conditionally rendered to prevent display bugs */}
      {!isLoginPage && (
        <aside
          key="admin-sidebar"
          className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}
        >
          <div className="sidebar-header">
            <div className="logo-container">
              <Image
                src="/webImages/logo.png"
                alt="E&D School"
                width={180}
                height={60}
                style={{ width: 'auto', height: '40px' }}
                priority
              />
            </div>
            {/* Close button for mobile inside sidebar */}
            {isMobile && (
              <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.href} className={pathname === item.href ? 'active' : ''}>
                  <Link href={item.href} title={item.name}>
                    <i className={`fas ${item.icon}`}></i>
                    <span className="nav-text">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={() => signOut({ callbackUrl: '/admin/login' })}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="admin-main" style={{ padding: isLoginPage ? 0 : undefined }}>
        {!isLoginPage && (
          <header className="admin-header">
            <div className="header-left">
              <button className="menu-toggle-btn" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </button>
              <div className="breadcrumbs">
                Admin / {pathname.split('/').pop()}
              </div>
            </div>

            <div className="user-profile">
              <div className="avatar">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="user-name">{session?.user?.name || 'Admin User'}</span>
            </div>
          </header>
        )}
        <div className={`content-wrapper ${isLoginPage ? 'login-wrapper' : ''}`} style={{ padding: isLoginPage ? 0 : '30px' }}>
          <Toaster position="top-right" reverseOrder={false} />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
