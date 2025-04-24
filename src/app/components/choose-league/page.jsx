'use client';

import Image from "next/image";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { useRouter } from "next/navigation";
import Layout2 from "@/components/layout2";
import AuthGuard from "@/components/authGuard/authGuard";

export default function league() {
  const router = useRouter(); 

  return (
    <AuthGuard>
      <Layout2>
        <div className="min-h-screen flex flex-col text-xl"> {/* Aumenta el tamaño de la fuente */}
          <div className="flex-1 flex flex-col items-center justify-center p-6"> {/* Aumenta el padding */}
            <Card className="w-full max-w-2xl p-10 space-y-10"> {/* Aumenta el padding y espacio */}
              <h2 className="text-3xl font-bold text-center">¿Qué deseas hacer?</h2> {/* Aumenta el tamaño del título */}
              <div className="grid md:grid-cols-2 gap-6"> {/* Aumenta el espacio entre botones */}
                <Button
                  variant="outline"
                  className="relative h-40 text-xl flex flex-col p-0 overflow-hidden"
                  onClick={() => router.push("/components/join-league")}
                >
                  <img src="/images/join-league.jpg" alt="icono join league" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">
                    Unirte a una liga
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="relative h-40 text-xl flex flex-col p-0 overflow-hidden"
                  onClick={() => router.push("/components/create-league")}
                >
                  <img src="/images/create-league.jpg" alt="icono create league" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">
                    Crear una liga
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout2>
    </AuthGuard>
  );
}
