import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahmed Abdelfatah Sabry Mohamed | Navigation & Space Technology',
  description: 'Personal portfolio of Ahmed Abdelfatah Sabry Mohamed, a Navigation Science and Space Technology student interested in space technology, navigation, networking, communications, and project management.',
  openGraph: { title: 'Ahmed Abdelfatah Sabry Mohamed | Navigation & Space Technology', description: 'A student portfolio exploring space technology, navigation, networking, communications, and engineering.', type: 'website' },
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#050706', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" dir="ltr"><body>{children}</body></html>;
}
