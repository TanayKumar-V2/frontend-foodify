import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Recipe Generator',
  description: 'Enter your ingredients and let AI create a recipe for you!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} 
          bg-cover bg-center bg-no-repeat bg-fixed
          bg-[url('https://t3.ftcdn.net/jpg/03/18/92/98/360_F_318929874_BjOfHFRXjHyJ3e3mnpg2G9nQtfc2T7DV.jpg')]
          relative 
          before:content-[''] before:absolute before:inset-0 
          before:bg-black/50 before:z-[-1]
        `}
      >
        {children}
      </body>
    </html>
  );
}