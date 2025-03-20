"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import LeagueMessage from "@/components/home_log/mensajes";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("webToken");

    if (!token) {
      router.push("/components/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <p className="text-center mt-20 text-lg">Verificando sesión...</p>;
  }

  return (
    <Layout currentPage="Inicio">
      <main className="p-8">
        <div className="max-w-2xl mx-auto">
          <LeagueMessage type="join" />
          <LeagueMessage type="leave" />
          <LeagueMessage type="position" participants={["Charlie"]} />
        </div>
      </main>
    </Layout>
  );
}
