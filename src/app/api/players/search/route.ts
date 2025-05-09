import { NextResponse } from "next/server";
import { balldontlie } from "@/lib/balldontlie";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const { data: players } = await balldontlie.nba.getPlayers({
      search: query,
      per_page: 10,
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error searching players:", error);
    return NextResponse.json(
      { error: "Failed to search players" },
      { status: 500 }
    );
  }
}
