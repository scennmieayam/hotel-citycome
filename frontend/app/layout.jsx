import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600', '700'], subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata = {
  title: 'Hotel Citycome',
  description: 'Rasakan kenyamanan dan keindahan di Hotel Citycome. Pesan kamar Anda hari ini.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable} scroll-smooth scroll-pt-20`}>
      <body className="font-sans antialiased bg-[#f5f5f0] text-[#2d2d2a]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
