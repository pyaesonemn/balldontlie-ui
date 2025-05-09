"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { DreamTeam } from "@/lib/store/types";
import { deleteTeam, removePlayerFromTeam } from "@/lib/store/teamSlice";
import { useAuth } from "@/lib/AuthContext";

import { IoPencil, IoTrashOutline } from "react-icons/io5";

interface TeamCardProps {
  team: DreamTeam;
  onManageTeam: (teamId: string) => void;
}

export default function TeamCard({ team, onManageTeam }: TeamCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this team?")) {
      dispatch(deleteTeam(team.id));
    }
  };

  const handleRemovePlayer = (playerId: number) => {
    dispatch(removePlayerFromTeam({ teamId: team.id, playerId }));
  };

  const isOwner = user && user.id === team.createdBy;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 cursor-pointer flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <h3 className="font-medium text-black text-lg">{team.name}</h3>
          {/* <p className="text-sm text-gray-500 flex flex-row items-center gap-1">
            <div className="font-medium w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center">
              {team.players.length}
            </div>{" "}
            {team.players.length === 1 ? "player" : "players"}
          </p> */}
        </div>
        <div className="flex items-center space-x-2">
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <IoTrashOutline className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManageTeam(team.id);
            }}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            <IoPencil className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="py-2 px-4 border-t">
        <h6 className="text-sm text-gray-500">
          <span className="font-medium text-orange-600">
            {team.players.length}
          </span>{" "}
          {team.players.length <= 1 ? "Player" : "Players"}
        </h6>
        {team.players.length === 0 ? (
          <p className="text-sm text-gray-500">No players added yet</p>
        ) : (
          <ul className="divide-y">
            {team.players.map((player) => (
              <li
                key={player.id}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <p className="text-black font-medium">
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {player.position} | {player.team.full_name}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
