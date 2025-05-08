"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const TeamsPage = () => {
  const { isAuthenticated } = useAuth();

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

  return <div>TeamsPage</div>;
};

export default TeamsPage;
