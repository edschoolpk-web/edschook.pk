"use client";

import React, { useState } from 'react';
import { updatePassword, createAdminUser } from '@/app/actions/settings';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await updatePassword(formData);
        setLoading(false);

        if (result.success) {
            toast.success(result.message || 'Updated successfully');
            (document.getElementById('password-form') as HTMLFormElement).reset();
        } else {
            toast.error(result.error as string);
        }
    }

    async function handleCreateUser(formData: FormData) {
        setUserLoading(true);
        const result = await createAdminUser(formData);
        setUserLoading(false);

        if (result.success) {
            toast.success(result.message || 'User created successfully');
            (document.getElementById('create-user-form') as HTMLFormElement).reset();
        } else {
            toast.error(result.error as string);
        }
    }

    return (
        <div className="settings-container">
            {/* ... header ... */}

            <div className="settings-grid">
                {/* Profile Card */}
                <div className="settings-card profile-card">
                    <div className="card-content">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                                <h3>{session?.user?.name || 'Admin User'}</h3>
                                <span className="badge">{session?.user?.role || 'Administrator'}</span>
                            </div>
                        </div>
                        <div className="profile-info">
                            <p><strong>Email:</strong> {session?.user?.email || 'Loading...'}</p>
                            <p><strong>Role:</strong> {session?.user?.role || 'Super Admin'}</p>
                        </div>
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="settings-card password-card">
                    <div className="card-header">
                        <h2>Change Password</h2>
                        <p>Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <form id="password-form" action={handleSubmit} className="password-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" name="currentPassword" placeholder="Enter current password" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-key input-icon"></i>
                                <input type="password" name="newPassword" placeholder="Enter new password (min 6 chars)" required minLength={6} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Create User Card */}
                <div className="settings-card user-card">
                    <div className="card-header">
                        <h2>Create New Admin</h2>
                        <p>Register a new user to access the admin panel.</p>
                    </div>

                    <form id="create-user-form" action={handleCreateUser} className="user-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" name="name" placeholder="Ex: John Doe" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input type="email" name="email" placeholder="admin@example.com" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" name="password" placeholder="Min 6 characters" required minLength={6} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={userLoading}>
                                {userLoading ? 'Creating...' : 'Create Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="branding-footer">
                <p>Secure Admin Panel powered by <strong>ITN</strong></p>
            </div>

            <style jsx>{`
        .settings-container {
          animation: fadeIn 0.5s ease;
          max-width: 1000px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #2B3674;
          margin: 0;
        }

        .settings-header p {
          color: #A3AED0;
          margin: 5px 0 0;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        @media (max-width: 900px) {
            .settings-grid {
                grid-template-columns: 1fr;
            }
        }

        .settings-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .settings-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        /* PROFILE CARD STYLES */
        .profile-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
        }

        .profile-avatar {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4318FF 0%, #868CFF 100%);
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(67, 24, 255, 0.3);
        }

        .profile-header h3 {
            margin: 0;
            color: #2B3674;
            font-size: 18px;
        }

        .badge {
            background: #E6F7FF;
            color: #0091FF;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .profile-info p {
            margin: 10px 0;
            color: #707EAE;
            font-size: 14px;
        }

        .profile-info strong {
            color: #2B3674;
        }

        /* PASSWORD CARD STYLES */
        .card-header {
            margin-bottom: 25px;
        }

        .card-header h2 {
            margin: 0;
            font-size: 20px;
            color: #2B3674;
        }

        .card-header p {
            margin: 5px 0 0;
            color: #A3AED0;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2B3674;
            font-weight: 500;
            font-size: 14px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #A3AED0;
            font-size: 14px;
            z-index: 1;
        }

        input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #E0E5F2;
            border-radius: 12px;
            color: #1B2559;
            font-size: 14px;
            transition: all 0.2s;
            background: #F4F7FE; /* Slightly darker bg for inputs */
        }

        input:focus {
            outline: none;
            border-color: #4318FF;
            background: white;
            box-shadow: 0 0 0 3px rgba(67, 24, 255, 0.1);
        }

        .form-actions {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }

        .save-btn {
            background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 10px rgba(67, 24, 255, 0.3);
        }

        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(67, 24, 255, 0.4);
        }

        .save-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        /* FOOTER */
        .branding-footer {
            text-align: center;
            margin-top: 40px;
            color: #A3AED0;
            font-size: 13px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
