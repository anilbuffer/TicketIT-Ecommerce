import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Rahhawan | Pharmaceutical Logistics & SaaS Platform',
  description: 'Enterprise pharmaceutical logistics, dispensing hub fulfillment, and courier routing management portal.',
  keywords: ['pharmaceutical logistics', 'dispensing hub', 'courier portal', 'SaaS platform', 'healthcare logistics', 'HIPAA compliant'],
  authors: [{ name: 'Rahhawan Platform HQ' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
