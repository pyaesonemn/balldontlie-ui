import { NextResponse } from "next/server";
import { balldontlie } from "@/lib/balldontlie";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");

    const { data: players } = await balldontlie.nba.getPlayers({
      cursor,
      per_page,
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
