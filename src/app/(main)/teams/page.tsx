"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useAppSelector } from "@/lib/store/hooks";
import TeamCard from "@/components/TeamCard";
import TeamFormModal from "@/components/TeamFormModal";

const TeamsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { teams } = useAppSelector((state) => state.teams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(
    undefined
  );

  const openCreateModal = () => {
    setSelectedTeamId(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeamId(undefined);
  };

  if (!isAuthenticated) {
    return (
      <div className="-mt-10 flex flex-col gap-4 justify-center items-center h-screen">
        <h2 className="text-2xl font-medium tracking-wide">
          Please login to create a team.
        </h2>
        <Link
          href="/login"
          className="bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }

  // Filter teams created by the current user
  const userTeams = teams.filter((team) => team.createdBy === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dream Teams</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Create New Team
        </button>
      </div>

      {userTeams.length === 0 ? (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-medium mb-4">
            You haven&apos;t created any teams yet
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Create your first dream team by clicking the &quot;Create New
            Team&quot; button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onManageTeam={() => openEditModal(team.id)}
            />
          ))}
        </div>
      )}

      <TeamFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        teamId={selectedTeamId}
      />
    </div>
  );
};

export default TeamsPage;
