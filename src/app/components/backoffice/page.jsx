// app/backoffice/page.jsx
"use client";

import Layout from "@/components/layout";
import { Button } from '@/components/ui';  // Importación desde la librería

export default function BackOfficePage() {
  return (
    <Layout currentPage="Back Office">
      <main className="p-8 max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold text-center">Panel de Administración</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="secondary">Gestionar Usuarios</Button>
          <Button variant="secondary">Ver Estadísticas</Button>
          <Button variant="secondary">Gestionar Productos</Button>
          <Button variant="secondary">Ajustes</Button>
        </div>
      </main>
    </Layout>
  );
}
