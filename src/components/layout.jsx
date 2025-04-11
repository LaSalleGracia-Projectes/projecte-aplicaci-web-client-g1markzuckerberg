'use client'
import Header from "@/components/header-fantasy";
import Footer from "@/components/footer-fantasy";
import Navbar from "@/components/menu-opciones";
import { LigaProvider } from "@/context/ligaContext";

// Main layout that provides the liga context
export default function Layout({ children, currentPage }) {
  return (
    <LigaProvider>
      <Header />
      <Navbar currentPage={currentPage} />
      <main className="min-h-screen p-4">{children}</main>
      <Footer />
    </LigaProvider>
  );
}