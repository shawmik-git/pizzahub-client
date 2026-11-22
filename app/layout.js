import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = { title: "PizzaHub — Pizza Ordering & Delivery", description: "Discover local pizza shops, browse menus and order fresh pizza." };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}<Toaster position="top-right" toastOptions={{ duration: 3500 }} /></body>
    </html>
  );
}
