'use client';

import Dock from '@/components/reactbits/Dock';
import { Home, Settings, User, BarChart2, Mail, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type DashboardDockProps = {
  userId?: string;
};

export default function DashboardDock({ userId }: DashboardDockProps) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      icon: <Home size={18} />,
      label: 'Home',
      className: pathname === '/dashboard' ? 'border-violet-400/60 ring-2 ring-violet-300/40' : '',
      onClick: () => router.push('/dashboard'),
    },
    {
      icon: <BarChart2 size={18} />,
      label: 'ATS',
      className: pathname?.startsWith('/dashboard/ats') ? 'border-violet-400/60 ring-2 ring-violet-300/40' : '',
      onClick: () => router.push('/dashboard/ats'),
    },
    {
      icon: <Search size={18} />,
      label: 'Jobs',
      className: pathname?.startsWith('/dashboard/jobs') ? 'border-violet-400/60 ring-2 ring-violet-300/40' : '',
      onClick: () => router.push(userId ? `/dashboard/jobs/${userId}` : '/dashboard/jobs'),
    },
    {
      icon: <Mail size={18} />,
      label: 'HR',
      className: pathname?.startsWith('/dashboard/hr-contacts') ? 'border-violet-400/60 ring-2 ring-violet-300/40' : '',
      onClick: () => router.push(userId ? `/dashboard/hr-contacts/${userId}` : '/dashboard/hr-contacts'),
    },
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      className: pathname?.startsWith('/dashboard/settings') ? 'border-violet-400/60 ring-2 ring-violet-300/40' : '',
      onClick: () => router.push('/dashboard/settings'),
    },
  ];

  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      className="z-50"
    />
  );
}
