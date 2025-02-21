// pages/index.js
import Layout from "@/components/layout";
import LeagueMessage from "@/components/home_log/mensajes";

export default function Home() {
  return (
    <Layout currentPage="Inicio"> {/* Pasamos "Inicio" */}
    <main className="p-8">
      <div className="max-w-2xl mx-auto">
        <LeagueMessage type="join" participants={["Alice"]} />
        <LeagueMessage type="leave" participants={["Bob"]} />
        <LeagueMessage type="position" participants={["Charlie"]} />
        <LeagueMessage type="ranking" participants={["David", "Eve", "Frank"]} />
        <LeagueMessage type="join" participants={["Grace"]} />
      </div>
    </main>
    </Layout>
  );
}