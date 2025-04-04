import { LeagueProvider } from "@/context/league-context";
import "tailwindcss/tailwind.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <LeagueProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </LeagueProvider>
      </body>
    </html>
  );
}
