// pages/clasificacion.js
import Layout from "@/components/layout";
import Link from "@/components/clasificacion/columnas";

export default function Clasificacion() {
  return (
    <Layout currentPage="Clasificacion"> {/* Pasamos "Clasificacion" */}
<div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Bienvenido a la Liga</h1>
      <Link href="/player-info">
        <a className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
          Ver Información de Jugadores
        </a>
      </Link>
    </div>
    </Layout>
  );
}