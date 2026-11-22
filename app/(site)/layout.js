import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  return (<><Navbar /><main className="min-h-[70vh]">{children}</main><Footer /></>);
}
