import { Team } from "./teams.types";

export type Player = {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: "31";
  college: "Texas";
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: Team;
};
