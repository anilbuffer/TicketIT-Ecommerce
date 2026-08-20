import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MobileNav } from '../components/layout/MobileNav';
import { CartDrawer } from '../components/features/CartDrawer';

export const metadata: Metadata = {
  title: 'TicketIT | Modern Live Events, Concerts & Festival Tickets',
  description: 'Book verified tickets for world-class concerts, EDM music festivals, keynote tech conferences, and live sports tournaments with instant mobile delivery.',
  keywords: ['tickets', 'concerts', 'festivals', 'events', 'live shows', 'ecommerce', 'booking'],
  authors: [{ name: 'TicketIT' }],
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
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <CartDrawer />
            <MobileNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
