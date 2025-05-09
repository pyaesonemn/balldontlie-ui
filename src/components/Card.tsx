import { NBAPlayer } from "@balldontlie/sdk";
import { FC } from "react";

interface CardProps {
  player: NBAPlayer;
}

const Card: FC<CardProps> = ({ player }) => {
  return (
    <div className="flex flex-col border-b border-orange-500/50 p-4">
      <div className="text-2xl font-bold min-h-20">
        {player.first_name} {player.last_name}
      </div>
      <div className="text-sm text-gray-500">
        Position: {player.position}
        <br />
        Team: {player.team.name}
        <br />
        Height: {player.height}
        <br />
        Weight: {player.weight}
      </div>
    </div>
  );
};

export default Card;
