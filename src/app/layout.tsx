import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'TicketIT | Marketing Collateral & Digital Asset Ordering Platform',
  description: 'Self-service digital asset library and collateral ordering portal with consolidated monthly multi-site billing and DAM integration.',
  keywords: ['TicketIT', 'marketing collateral', 'digital asset management', 'DAM', 'point of sale', 'consolidated billing', 'multi-site ordering'],
  authors: [{ name: 'TicketIT Platform HQ' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f73582',
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
