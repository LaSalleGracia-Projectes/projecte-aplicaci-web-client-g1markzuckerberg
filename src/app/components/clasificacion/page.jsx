// pages/clasificacion.js
"use client";

import Layout from "@/components/layout";
import Link from "next/link";
import AuthGuard from "@/components/authGuard/authGuard";
import { useLeague } from "@/context/league-context";

export default function Clasificacion() {
  const { leagueCode } = useLeague(); // Obtenemos el código de la liga desde el contexto

  return (
    <AuthGuard>
      <Layout currentPage="Clasificacion">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Bienvenido a la Liga</h1>
          {console.log("Código de liga:", leagueCode)}
          {/* Mostramos el código de la liga si está disponible */}
          {leagueCode ? (
            <p className="mt-2 text-lg">
              Código de Liga: <span className="font-semibold">{leagueCode}</span>
            </p>
          ) : (
            <p className="mt-2 text-lg text-red-500">No estás inscrito en ninguna liga</p>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
