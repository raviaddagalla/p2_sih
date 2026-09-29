'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { DemoModePanel } from '@/components/common/DemoModePanel';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-canvas text-primary">
        {children}
        <CommandPalette />
        <DemoModePanel />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <CommandPalette />
      <DemoModePanel />
    </div>
  );
};
