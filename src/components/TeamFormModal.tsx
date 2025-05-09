"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createTeam,
  removePlayerFromTeam,
  updateTeam,
} from "@/lib/store/teamSlice";
import { useAuth } from "@/lib/AuthContext";
import Modal from "./Modal";
import { Player } from "@/lib/store/types";
import PlayerSearch from "./PlayerSearch";
import { IoClose, IoWarning } from "react-icons/io5";

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
}

export default function TeamFormModal({
  isOpen,
  onClose,
  teamId,
}: TeamFormModalProps) {
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "players">("details");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { teams } = useAppSelector((state) => state.teams);
  const selectedTeam = teamId
    ? teams.find((team) => team.id === teamId)
    : undefined;

  useEffect(() => {
    if (selectedTeam) {
      setTeamName(selectedTeam.name);
      setActiveTab("details");
    } else {
      setTeamName("");
      setSelectedPlayers([]);
    }
    setError(null);
  }, [selectedTeam, isOpen]);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !user) return;

    if (isCreateMode) {
      const duplicatePlayers = selectedPlayers.filter((player) =>
        teams.some((team) => team.players.some((p) => p.id === player.id))
      );

      if (duplicatePlayers.length > 0) {
        const playerNames = duplicatePlayers
          .map((p) => `${p.first_name} ${p.last_name}`)
          .join(", ");
        setError(`Players already in other teams: ${playerNames}`);
        return;
      }
    }

    if (isCreateMode) {
      dispatch(
        createTeam({
          name: teamName.trim(),
          players: selectedPlayers,
          createdBy: user.id,
        })
      );
    } else if (teamId) {
      dispatch(
        updateTeam({
          teamId,
          name: teamName.trim(),
        })
      );
    }

    handleClose();
  };

  const handleAddPlayer = (player: Player) => {
    setError(null);

    // Check if the player already exists in any team
    const playerExistsInAnyTeam = teams.some((team) => {
      if (teamId && team.id === teamId) return false;
      return team.players.some((p) => p.id === player.id);
    });

    if (playerExistsInAnyTeam) {
      setError(
        `${player.first_name} ${player.last_name} is already in another dream team.`
      );
      return;
    }

    if (isCreateMode) {
      // For create mode, add to temporary array
      if (!selectedPlayers.some((p) => p.id === player.id)) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    } else if (teamId) {
      // For edit mode, dispatch to redux directly
      dispatch({
        type: "teams/addPlayerToTeam",
        payload: { teamId, player },
      });
    }
  };

  const handleRemovePlayer = (playerId: number) => {
    setError(null); // Clear any existing errors

    if (isCreateMode) {
      // For create mode, remove from temporary array
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
    } else if (teamId) {
      // For edit mode, dispatch to redux
      dispatch(removePlayerFromTeam({ teamId, playerId }));
    }
  };

  const handleClose = () => {
    setTeamName("");
    setSelectedPlayers([]);
    setActiveTab("details");
    setError(null);
    onClose();
  };

  const isCreateMode = !teamId;
  const modalTitle = isCreateMode ? "Create Dream Team" : "Manage Dream Team";

  // Players to display depends on if we're in create or edit mode
  const displayPlayers = isCreateMode
    ? selectedPlayers
    : selectedTeam?.players || [];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
          <div className="flex items-center">
            <IoWarning className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="mb-4 border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Team Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "players"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("players")}
          >
            Players
          </button>
        </div>
      </div>

      {activeTab === "details" ? (
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black placeholder:text-black/20 border-gray-300 rounded-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter team name"
              required
            />
          </div>

          {isCreateMode && selectedPlayers.length > 0 && (
            <div className="mt-2 py-2 px-3 bg-orange-50 border border-orange-200 rounded-md text-sm text-black/50 flex justify-between items-center">
              <div>
                <span className="font-medium">{selectedPlayers.length}</span>{" "}
                {selectedPlayers.length === 1 ? "player" : "players"} selected
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("players")}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View Players
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {isCreateMode ? "Create" : "Update"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-black">
          <h3 className="font-medium">
            Add Players to {isCreateMode ? "Your Team" : selectedTeam?.name}
          </h3>

          <PlayerSearch
            teamId={teamId || "temp"}
            customAddHandler={handleAddPlayer}
          />

          <div className="mt-6">
            <h3 className="font-medium mb-2">Current Players</h3>
            {displayPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No players added yet</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y">
                  {displayPlayers.map((player: Player) => (
                    <li
                      key={player.id}
                      className="p-3 flex justify-between items-center hover:bg-gray-50"
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
                        onClick={() => handleRemovePlayer(player.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <IoClose className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {isCreateMode && (
            <div className="mt-8 bg-gray-50 p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  {selectedPlayers.length > 0
                    ? `${selectedPlayers.length} players selected`
                    : "No players selected yet"}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Back to Details
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Go back to Details tab to save your team
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
