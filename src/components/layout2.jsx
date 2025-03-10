// components/Layout.js
import Header from "@/components/header-fantasy";
import Footer from "@/components/footer-fantasy";
import Navbar from "@/components/menu-opciones";

export default function Layout({ children, currentPage }) {
  return (
    <>
      <Header />
      <main className="min-h-screen p-4">{children}</main>
      <Footer />
    </>
  );
}