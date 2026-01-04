"use server";

import React from 'react';
import { getDashboardStats } from '@/app/actions/dashboard';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
  const { data: stats } = await getDashboardStats();

  const safeStats = {
    counts: stats?.counts || { teachers: 0, gallery: 0, activeNotice: false },
    recentActivity: (stats?.recentActivity || []).map((t: any) => ({
      ...t,
      formattedDate: new Date(t.createdAt).toLocaleDateString('en-US')
    }))
  };

  return <DashboardClient stats={safeStats} />;
}
