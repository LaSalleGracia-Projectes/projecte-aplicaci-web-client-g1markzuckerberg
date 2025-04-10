'use client';
import Header from "@/components/header-fantasy";
import Footer from "@/components/footer-fantasy";
import Navbar from "@/components/menu-opciones";
import { LeagueProvider, useLeague } from "@/context/ligaContext";

// 🔁 Renombramos este componente interno
function LayoutContent({ children, currentPage }) {
  const { currentLeague, loading } = useLeague();

  return (
    <>
      <Header />
      <Navbar currentPage={currentPage} leagueName={currentLeague?.name} />
      <main className="min-h-screen p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando información de la liga...</p>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </>
  );
}

// ✅ Ahora no hay conflicto de nombres
export default function Layout({ children, currentPage }) {
  return (
    <LeagueProvider>
      <LayoutContent currentPage={currentPage}>
        {children}
      </LayoutContent>
    </LeagueProvider>
  );
}
