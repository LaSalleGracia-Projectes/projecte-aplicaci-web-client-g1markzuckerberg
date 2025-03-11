// pages/index.js
import Layout from "@/components/layout";
import LeagueMessage from "@/components/home_log/mensajes";

export default function Home() {
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
