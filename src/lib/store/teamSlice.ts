import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DreamTeam, Player, TeamState } from "./types";

const initialState: TeamState = {
  teams: [],
};

// Helper function to check if a player exists in any team
const playerExistsInAnyTeam = (
  state: TeamState,
  playerId: number,
  excludeTeamId?: string
): boolean => {
  return state.teams.some((team) => {
    if (excludeTeamId && team.id === excludeTeamId) return false;
    return team.players.some((player) => player.id === playerId);
  });
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    createTeam: (
      state,
      action: PayloadAction<Omit<DreamTeam, "id" | "createdAt">>
    ) => {
      const duplicatePlayers = action.payload.players.filter((player) =>
        playerExistsInAnyTeam(state, player.id)
      );

      if (duplicatePlayers.length > 0) {
        console.warn(
          "Some players were already in other teams and were filtered out:",
          duplicatePlayers
            .map((p) => `${p.first_name} ${p.last_name}`)
            .join(", ")
        );

        action.payload.players = action.payload.players.filter(
          (player) => !playerExistsInAnyTeam(state, player.id)
        );
      }

      const newTeam: DreamTeam = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      state.teams.push(newTeam);
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
    },
    updateTeam: (
      state,
      action: PayloadAction<{ teamId: string; name: string }>
    ) => {
      const { teamId, name } = action.payload;
      const team = state.teams.find((team) => team.id === teamId);
      if (team) {
        team.name = name;
      }
    },
    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: string; player: Player }>
    ) => {
      const { teamId, player } = action.payload;
      const team = state.teams.find((team) => team.id === teamId);

      // Check if player is already in another team
      if (playerExistsInAnyTeam(state, player.id, teamId)) {
        console.warn(
          `Player ${player.first_name} ${player.last_name} is already in another team`
        );
        return; // Don't add the player
      }

      if (team) {
        // Check if player already exists in this team
        if (!team.players.some((p) => p.id === player.id)) {
          team.players.push(player);
        }
      }
    },
    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) => {
      const { teamId, playerId } = action.payload;
      const team = state.teams.find((team) => team.id === teamId);
      if (team) {
        team.players = team.players.filter((player) => player.id !== playerId);
      }
    },
  },
});

export const {
  createTeam,
  deleteTeam,
  updateTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
