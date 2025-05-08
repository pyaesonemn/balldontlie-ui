"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { NBAPlayer } from "@balldontlie/sdk";

export default function Home() {
  const [players, setPlayers] = useState<NBAPlayer[]>([]);
  const [cursor, setCursor] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 12;

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/players?page=${cursor}&per_page=${perPage}`
      );
      const data = await response.json();
      setPlayers((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const handleLoadMore = () => {
    setCursor((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-8">
        {players.map((player: NBAPlayer, index: number) => (
          <Card key={`${player.id}-${index}`} player={player} />
        ))}
      </div>

      <button
        onClick={handleLoadMore}
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 mb-10"
      >
        {loading ? "Loading..." : "Load More Players"}
      </button>
    </div>
  );
}
