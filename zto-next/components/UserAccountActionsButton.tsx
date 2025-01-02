"use client";
import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/store";
import { DEFAULT_PROFILE_PICTURE_URL } from "@/utils/constants";
import { API } from "@/api/API";
import DropdownWrapper from "./DropdownWrapper";

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

  type accountActionItem = {
    title: string;
    onClick?: () => void;
    image?: string;
  };

  const dropdownItems: accountActionItem[] = [
    {
      title: `${user.first_name} ${user.last_name}`,
      image: user.profile_picture_url || DEFAULT_PROFILE_PICTURE_URL,
    },
    {
      title: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <DropdownWrapper
      items={dropdownItems}
      tooltipMessage="Konto"
      renderItem={({ title, image, onClick }: accountActionItem) => {
        return image ? (
          <Link
            href="/user"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={image}
              alt="Profile Pic"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800 hover:underline">
                {title}
              </p>
            </div>
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="px-3 py-3 text-sm text-gray-800 font-medium hover:bg-gray-100 w-full text-left cursor-pointer"
          >
            {title}
          </button>
        );
      }}
    >
      <img
        src={user.profile_picture_url || DEFAULT_PROFILE_PICTURE_URL}
        alt={`${user.first_name} ${user.last_name}`}
        className="object-cover w-full h-full rounded-full"
      />
    </DropdownWrapper>
  );
};

export default UserAccountActionsButton;
