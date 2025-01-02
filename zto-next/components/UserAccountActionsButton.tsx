"use client";
import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import React from "react";
import Link from "next/link";

type Props = {};

const UserAccountActionsButton = (props: Props) => {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return null;
  }
  return (
    <Link href="/user">
      <button className="bg-white text-blue-700 px-4 py-2 rounded">
        My Account
      </button>
    </Link>
  );
};

export default UserAccountActionsButton;
