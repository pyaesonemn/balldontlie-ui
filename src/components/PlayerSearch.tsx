"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { Player } from "@/lib/store/types";
import { addPlayerToTeam } from "@/lib/store/teamSlice";

interface PlayerSearchProps {
  teamId: string;
  customAddHandler?: (player: Player) => void;
}

export default function PlayerSearch({
  teamId,
  customAddHandler,
}: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const searchPlayers = async () => {
      if (searchTerm.length < 2) {
        setPlayers([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/players/search?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error searching for players:", error);
        setPlayers([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      searchPlayers();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddPlayer = (player: Player) => {
    if (customAddHandler) {
      // Use custom handler if provided
      customAddHandler(player);
    } else {
      // Default behavior: add to redux store
      dispatch(addPlayerToTeam({ teamId, player }));
    }

    // Optionally clear search after adding
    setSearchTerm("");
    setPlayers([]);
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a player..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-black/20 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <svg
              className="animate-spin h-5 w-5 text-orange-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {players.length > 0 && (
        <div className="mt-2 border rounded-md max-h-64 overflow-y-auto bg-white">
          <ul className="divide-y">
            {players.map((player) => (
              <li
                key={player.id}
                className="p-2 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {player.position || "N/A"} | {player.team.full_name}
                  </p>
                </div>
                <button
                  onClick={() => handleAddPlayer(player)}
                  className="text-sm bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
