"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardProps {
  stats: {
    counts: {
      teachers: number;
      gallery: number;
      activeNotice: boolean;
    };
    recentActivity: Array<{
      id: string;
      name: string;
      role: string;
      image: string | null;
      formattedDate: string;
    }>;
  };
}

export default function DashboardClient({ stats }: DashboardProps) {
  const { data: session } = useSession();
  // Safe defaults
  const counts = stats?.counts || { teachers: 0, activeNotice: false };
  const recent = stats?.recentActivity || [];

  const [currentDate, setCurrentDate] = React.useState('');

  React.useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Welcome Back, {session?.user?.name || 'Admin'}!</h1>
          <p className="welcome-date">{currentDate}</p>
        </div>
        <div className="branding-badge">
          <span>Powered by</span>
          <span className="itn-text">ITN</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {/* Teachers Card */}
        <div className="stat-card card-purple">
          <div className="card-content">
            <div className="icon-wrapper">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div>
              <span className="stat-label">Total Teachers</span>
              <h3 className="stat-value">{counts.teachers}</h3>
            </div>
          </div>
          <div className="card-shine"></div>
        </div>

        {/* Gallery Card */}
        <div className="stat-card card-blue">
          <div className="card-content">
            <div className="icon-wrapper">
              <i className="fas fa-images"></i>
            </div>
            <div>
              <span className="stat-label">Gallery Images</span>
              <h3 className="stat-value">{counts.gallery}</h3>
            </div>
          </div>
          <div className="card-shine"></div>
        </div>

        {/* Notice Card */}
        <div className={`stat-card ${counts.activeNotice ? 'card-green' : 'card-orange'}`}>
          <div className="card-content">
            <div className="icon-wrapper">
              <i className={`fas ${counts.activeNotice ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            </div>
            <div>
              <span className="stat-label">Notice Board</span>
              <h3 className="stat-value">{counts.activeNotice ? 'Active' : 'Inactive'}</h3>
            </div>
          </div>
          <div className="card-shine"></div>
        </div>
      </div>

      {/* Main Content Area: Recent Activity & Branding */}
      <div className="content-grid">
        <div className="recent-activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Link href="/admin/teachers" className="view-all-link">View All</Link>
          </div>
          <div className="activity-list">
            {recent.length > 0 ? (
              recent.map((teacher: any) => (
                <div key={teacher.id} className="activity-item">
                  <div className="activity-avatar">
                    {teacher.image ? (
                      <Image src={teacher.image} alt={teacher.name} width={40} height={40} className="avatar-img" />
                    ) : (
                      <span className="avatar-placeholder">{teacher.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="activity-details">
                    <span className="activity-name">{teacher.name}</span>
                    <span className="activity-role">{teacher.role}</span>
                  </div>
                  <span className="activity-time">
                    {teacher.formattedDate}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-state">No recent activity found.</p>
            )}
          </div>
        </div>

        {/* Branding / Info Card */}
        <div className="system-info-card">
          <div className="brand-logo-large">
            <Image src="/itn_logo.png" alt="ITN" width={300} height={100} style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="system-details">
            <h3>IBMS Admin Panel</h3>
            <p>Itnnovator Business Management System</p>
            <span className="version-badge">Version 1.0.0</span>
          </div>
          <div className="support-link">
            <a href="https://itnnovator.com/contact" target="_blank" rel="noopener noreferrer">Contact Support</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
          animation: fadeIn 0.5s ease;
        }

        /* WELCOME BANNER */
        .welcome-banner {
          background: white;
          padding: 30px;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.02);
        }

        .welcome-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #2B3674;
        }

        .welcome-date {
          margin: 5px 0 0;
          color: #A3AED0;
          font-size: 14px;
        }
        
        .branding-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14px;
            color: #A3AED0;
        }
        
        .itn-text {
            font-weight: 800;
            color: #4318FF;
            letter-spacing: 1px;
        }

        /* STAT CARDS */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card {
          position: relative;
          padding: 24px;
          border-radius: 20px;
          color: white;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-height: 120px;
          display: flex;
          align-items: center;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .card-purple { background: linear-gradient(135deg, #868CFF 0%, #4318FF 100%); }
        .card-blue { background: linear-gradient(135deg, #3399ff 0%, #0055cc 100%); }
        .card-green { background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); }
        .card-orange { background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); }

        .card-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          backdrop-filter: blur(5px);
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          display: block;
          margin-bottom: 5px;
        }

        .stat-value {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .card-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(30deg);
          pointer-events: none;
        }

        /* CONTENT GRID */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        
        @media (max-width: 1024px) {
            .content-grid {
                grid-template-columns: 1fr;
            }
        }

        /* RECENT ACTIVITY */
        .recent-activity-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(0,0,0,0.02);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #2B3674;
        }

        .view-all-link {
          color: #4318FF;
          font-size: 14px;
          font-weight: 500;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .activity-item:hover {
          background: #F4F7FE;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: #E0E5F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #2B3674;
        }
        
        .avatar-img {
            object-fit: cover;
        }

        .activity-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .activity-name {
          font-weight: 600;
          color: #2B3674;
          font-size: 14px;
        }

        .activity-role {
          font-size: 12px;
          color: #A3AED0;
        }

        .activity-time {
          font-size: 12px;
          color: #A3AED0;
        }

        /* SYSTEM INFO / BRANDING */
        .system-info-card {
          background: white; /* Gradient */
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border: 1px solid rgba(0,0,0,0.02);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        
        .brand-logo-large {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
        }

        .system-details h3 {
            margin: 0;
            color: #2B3674;
            font-size: 20px;
            font-weight: 700;
        }
        
        .system-details p {
            margin: 5px 0;
            color: #A3AED0;
            font-size: 14px;
        }
        
        .version-badge {
            display: inline-block;
            background: #E6F7FF;
            color: #0091FF;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .support-link a {
            color: #A3AED0;
            font-size: 12px;
            text-decoration: underline;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
