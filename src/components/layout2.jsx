import Header from "@/components/header2";
import Footer from "@/components/footer-fantasy";

export default function Layout({ children, currentPage }) {
  return (
    <>
      <Header />
      <main className="min-h-screen p-4">{children}</main>
      <Footer />
    </>
  );
}