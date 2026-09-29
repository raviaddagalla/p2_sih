import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppShell } from '@/components/layout/AppShell';

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
    <html lang="en">
      <body className="bg-canvas text-primary min-h-screen antialiased selection:bg-brand-indigoTint selection:text-brand-indigo">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
