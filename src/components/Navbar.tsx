"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/" className="text-4xl text-orange-600 font-bold">
        NBA
      </Link>
      <ul className="flex gap-5 items-center">
        <li>
          <Link
            href="/teams"
            className={pathname === "/teams" ? "text-orange-600" : ""}
          >
            Teams
          </Link>
        </li>
        {isAuthenticated && user ? (
          <li className="flex items-center gap-3">
            <div className="bg-orange-600 text-white font-medium text-sm w-8 h-8 rounded-full flex items-center justify-center">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm py-2 px-4 bg-red-500 rounded-sm text-white"
            >
              Logout
            </button>
          </li>
        ) : (
          <li className="flex gap-2 divide-x-2 divide-orange-600/50">
            <Link
              href="/login"
              className="text-sm py-2 px-4 bg-orange-600 rounded-sm text-white"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
