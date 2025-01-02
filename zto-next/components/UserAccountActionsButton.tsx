"use client";
import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/store";
import { DEFAULT_PROFILE_PICTURE_URL } from "@/utils/constants";
import { API } from "@/api/API";

type Props = {};

const UserAccountActionsButton = (props: Props) => {
  const router = useRouter();

  const isAuthenticated = useIsAuthenticated();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const flushUser = useAppStore((state) => state.flushUser);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    flushUser();
    router.push("/login");
  };

  const getUserData = async () => {
    const user = await API.GET.user();
    if (!user) return;
    setUser(user);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const handleClickOutsideTheDropdown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideTheDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideTheDropdown);
    };
  }, [isDropdownOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 shadow-sm hover:shadow-md focus:outline-none"
        title="Konto"
        data-tooltip-target="tooltip-default"
      >
        <img
          src={user.profile_picture_url || DEFAULT_PROFILE_PICTURE_URL}
          alt={`${user.first_name} ${user.last_name}`}
          className="object-cover w-full h-full"
        />
      </button>

      <div
        id="tooltip-default"
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Konto
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <Link
            href="/user"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={user.profile_picture_url || DEFAULT_PROFILE_PICTURE_URL}
              alt="Profile Pic"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800 hover:underline">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </Link>

          <div className="border-t border-gray-200 "></div>

          <button
            onClick={handleLogout}
            className="px-3 py-3 text-sm text-gray-800 font-medium hover:bg-gray-100 w-full text-left cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountActionsButton;
