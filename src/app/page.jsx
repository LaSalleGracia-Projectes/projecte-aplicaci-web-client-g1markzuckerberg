import Image from "next/image"
import { Button } from "@/components/ui"
import { Card } from "@/components/ui"
import { Globe, ChevronDown } from "lucide-react"
import Layout2 from "@/components/layout2"

export default function Home() {
  return (
    <Layout2>
    <main className="min-h-screen bg-[#d9d9d9]">
      {/* First Screen */}
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 space-y-6">
          <div className="w-full max-w-[240px] aspect-[4/3] bg-[#e5e5ea]" />

          <Button className="w-full max-w-[240px] bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]">CREAR CUENTA</Button>

          <div className="text-center space-y-4">
            <p>Ya tengo cuenta</p>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-px bg-[#7d7d7d] flex-1 max-w-[100px]" />
              <span>o</span>
              <div className="h-px bg-[#7d7d7d] flex-1 max-w-[100px]" />
            </div>
            <p>Inicia sesión con :</p>
            <button className="p-2 border rounded-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-gA3X4Rdj8u2DDTqSJLL3cOUiWnwt8b.png"
                alt="Google Sign In"
                width={32}
                height={32}
                className="mx-auto"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Second Screen */}
      <div className="min-h-screen flex flex-col">
        <header className="bg-[#787878] py-4">
          <h1 className="text-center text-3xl font-normal">FantasyDraft</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-8 space-y-8">
            <h2 className="text-2xl text-center">¿Qué deseas hacer?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-32 text-lg flex flex-col gap-4">
                <div className="w-16 h-16 bg-[#e5e5ea]" />
                Unete a una liga
              </Button>
              <Button variant="outline" className="h-32 text-lg flex flex-col gap-4">
                <div className="w-16 h-16 bg-[#e5e5ea]" />
                Crear una liga
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
    </Layout2>
  )
}
