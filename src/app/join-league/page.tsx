import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function JoinLeague() {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h2 className="text-xl font-medium">Unirse a una liga</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">Introduce la ID de la liga que te proporciona el creador de esta:</p>
          <Input type="text" placeholder="ID de la liga" />
        </div>

        <Button className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]">UNIRSE A LIGA</Button>
      </div>
    </div>
  )
}

