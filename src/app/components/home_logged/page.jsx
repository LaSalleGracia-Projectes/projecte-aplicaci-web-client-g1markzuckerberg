import Layout from "@/components/layout";
import LeagueMessage from "@/components/home_log/mensajes";
import AuthGuard from "@/components/authGuard/authGuard";
import Button from "@/components/ui"

export default function Home() {
  return (
  <AuthGuard>
      <Layout currentPage="Inicio">
        <main className="p-8">
          <div className="max-w-2xl mx-auto">
            <LeagueMessage type="join" />
            <LeagueMessage type="leave" />
            <LeagueMessage type="position" participants={["Charlie"]} />
          </div>

          <Button onClick={() => router.push("/backoffice")}>
            Ir al Back Office
          </Button>
          
        </main>
      </Layout>
    </AuthGuard>
  );
}
