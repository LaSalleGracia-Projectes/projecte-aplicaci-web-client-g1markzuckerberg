"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { ArrowLeft, Download } from "lucide-react";
import Layout2 from "@/components/layout2";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/authGuard/authGuard";
import { useState } from "react";
import { LigaProvider } from "@/context/ligaContext";

// Separate the inner component that will use the hook
function CreateLeagueContent() {
  const router = useRouter();
  // We'll use local state for now and handle liga context later
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateLeague = async () => {
    setError("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("webToken");
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3000/api/v1/liga/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear la liga");
      }

      // Get the created liga data with the code
      const responseData = await res.json();
      
      // Save the liga code to localStorage
      if (responseData.liga && responseData.liga.code) {
        localStorage.setItem('currentLigaCode', responseData.liga.code);
      }

      router.push("/components/home_logged");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/components/choose-league" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h2 className="text-xl font-medium">CREAR LIGA</h2>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre de la liga:
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Subir imagen de perfil de la liga:</label>
            <div className="bg-[#e5e5ea] p-4 text-center rounded-lg">
              <p className="text-sm mb-2">Arrastrar imagen</p>
              <p className="text-sm mb-4">o</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Seleccionar imagen
              </Button>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
          onClick={handleCreateLeague}
          disabled={loading}
        >
          {loading ? "Creando..." : "CREAR LIGA"}
        </Button>
      </div>
    </div>
  );
}

// Main component that provides the context
export default function CreateLeague() {
  return (
    <LigaProvider>
      <AuthGuard>
        <Layout2>
          <CreateLeagueContent />
        </Layout2>
      </AuthGuard>
    </LigaProvider>
  );
}