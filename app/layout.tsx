import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

const description =
  'Chat with Allyssa Bulo’s AI avatar: GoHighLevel, monday.com and Make.com automations for real estate and rental teams, plus applied AI with Claude.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name}, ${SITE.role}`,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: `${SITE.name}, ${SITE.role}`,
    description,
    url: '/',
    siteName: SITE.name,
  },
  twitter: { card: 'summary_large_image', title: `${SITE.name}, ${SITE.role}`, description },
  other: { 'page-type': 'software', 'site-kind': 'software' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Set the theme before first paint so there is no flash. Light is the default;
// dark only when the visitor chose it with the toggle (saved in localStorage).
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';if(t==='dark'){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute('content','#000000')}}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-type="software" data-theme="light" data-motion="on" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
