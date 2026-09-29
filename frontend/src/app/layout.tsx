import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { DemoModePanel } from '@/components/common/DemoModePanel';

export const metadata: Metadata = {
  title: 'ChainShield — Real-Time Crypto Fraud Attribution Platform',
  description: 'Forensic cryptocurrency attribution and freeze platform for Indian Law Enforcement Agencies (LEAs).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070B14] text-slate-100 min-h-screen antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        <CommandPalette />
        <DemoModePanel />
      </body>
    </html>
  );
}
