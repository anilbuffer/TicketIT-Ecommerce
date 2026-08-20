import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MobileNav } from '../components/layout/MobileNav';
import { RoleSwitcherWidget } from '../components/auth/RoleSwitcherWidget';

export const metadata: Metadata = {
  title: 'Yellow Marketing | Digital Asset Delivery & Ecommerce CMS Portal',
  description: 'Enterprise self-service portal for approved marketing assets, collateral ordering, and multi-site consolidated billing.',
  keywords: ['marketing collateral', 'DAM', 'digital asset management', 'ecommerce cms', 'consolidated billing', 'self-service portal'],
  authors: [{ name: 'Yellow Marketing Delivery Platform' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#10b981',
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
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <MobileNav />
            <RoleSwitcherWidget />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
