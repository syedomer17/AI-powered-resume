'use client';

import Dock from '@/components/reactbits/Dock';
import { 
  Home, 
  Settings, 
  TrendingUp, 
  Briefcase, 
  Users, 
  FileText 
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type DashboardDockProps = {
  userId?: string;
};

export default function DashboardDock({ userId }: DashboardDockProps) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      icon: <Home size={20} className="sm:w-5 sm:h-5 text-white stroke-white" style={{ color: 'white', stroke: 'white' }} />,
      label: 'Dashboard',
      className: pathname === '/dashboard' ? '!border-violet-500/80 !ring-2 !ring-violet-400/40 !bg-violet-900/40' : '',
      onClick: () => router.push('/dashboard'),
    },
    {
      icon: <TrendingUp size={20} className="sm:w-5 sm:h-5 text-white stroke-white" style={{ color: 'white', stroke: 'white' }} />,
      label: 'ATS Score',
      className: pathname?.startsWith('/dashboard/ats') ? '!border-violet-500/80 !ring-2 !ring-violet-400/40 !bg-violet-900/40' : '',
      onClick: () => router.push('/dashboard/ats'),
    },
    {
      icon: <Briefcase size={20} className="sm:w-5 sm:h-5 text-white stroke-white" style={{ color: 'white', stroke: 'white' }} />,
      label: 'Job Search',
      className: pathname?.startsWith('/dashboard/jobs') ? '!border-violet-500/80 !ring-2 !ring-violet-400/40 !bg-violet-900/40' : '',
      onClick: () => router.push(userId ? `/dashboard/jobs/${userId}` : '/dashboard/jobs'),
    },
    {
      icon: <Users size={20} className="sm:w-5 sm:h-5 text-white stroke-white" style={{ color: 'white', stroke: 'white' }} />,
      label: 'HR Contacts',
      className: pathname?.startsWith('/dashboard/hr-contacts') ? '!border-violet-500/80 !ring-2 !ring-violet-400/40 !bg-violet-900/40' : '',
      onClick: () => router.push(userId ? `/dashboard/hr-contacts/${userId}` : '/dashboard/hr-contacts'),
    },
    {
      icon: <Settings size={20} className="sm:w-5 sm:h-5 text-white stroke-white" style={{ color: 'white', stroke: 'white' }} />,
      label: 'Settings',
      className: pathname?.startsWith('/dashboard/settings') ? '!border-violet-500/80 !ring-2 !ring-violet-400/40 !bg-violet-900/40' : '',
      onClick: () => router.push('/dashboard/settings'),
    },
  ];

  return (
    <Dock
      items={items}
      panelHeight={60}
      baseItemSize={48}
      magnification={64}
      distance={140}
      className="z-50"
    />
  );
}
