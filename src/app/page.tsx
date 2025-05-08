import Card from "@/components/Card";
import { balldontlie } from "@/lib/balldontlie";
import { NBAPlayer } from "@balldontlie/sdk";

export default async function Home() {
  const { data: players } = await balldontlie.nba.getPlayers({ per_page: 10 });
  // const { data: teams } = await balldontlie.nba.getTeams();

  console.log(players);

  return (
    <main className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {players.map((player: NBAPlayer) => (
          <Card key={player.id} player={player} />
        ))}
      </div>
    </main>
  );
}
