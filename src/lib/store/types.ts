export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  team: {
    id: number;
    name: string;
    full_name: string;
    abbreviation: string;
  };
}

export interface DreamTeam {
  id: string;
  name: string;
  players: Player[];
  createdBy: string; // user id
  createdAt: number;
}

export interface TeamState {
  teams: DreamTeam[];
}
