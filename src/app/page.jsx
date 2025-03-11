'use client';

import Image from "next/image";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { useRouter } from "next/navigation";
import Layout2 from "@/components/layout2";

export default function Home() {
  const router = useRouter();

  return (
    <Layout2>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-8 space-y-8">
            <h2 className="text-2xl text-center">¿Qué deseas hacer?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-32 text-lg flex flex-col gap-4"
                onClick={() => router.push("/components/join-league")}
              >
                <div className="w-16 h-16 bg-[#e5e5ea]" />
                Unirte a una liga
              </Button>

              {/* ✅ Redirige a create-league */}
              <Button
                variant="outline"
                className="h-32 text-lg flex flex-col gap-4"
                onClick={() => router.push("/components/create-league")}
              >
                <div className="w-16 h-16 bg-[#e5e5ea]" />
                Crear una liga
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout2>
  );
}
