"use client";

import { useAppStore } from "@/store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { API } from "@/api/API";
import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import { DEFAULT_PROFILE_PICTURE_URL } from "@/utils/constants";
import usePolling from "@/hooks/usePolling";
import DropdownWrapper from "./DropdownWrapper";
import Link from "next/link";
import { IFriendRequest } from "@/types/friends";

const PendingFriendRequestsButton = () => {
  const isAuthenticated = useIsAuthenticated();
  const pendingFriendRequests = useAppStore(
    (state) => state.pendingFriendRequests
  );
  const setPendingFriendRequests = useAppStore(
    (state) => state.setPendingFriendRequests
  );

  const getData = async () => {
    if (!isAuthenticated) return;

    try {
      const pendingFriendRequestsResponse =
        await API.GET.pendingFriendRequests();
      setPendingFriendRequests(pendingFriendRequestsResponse.pending_requests);
    } catch (err) {
      console.error(err);
    }
  };

  const manageFriendRequest = async (
    request: IFriendRequest,
    answer: boolean
  ) => {
    try {
      await API.PATCH.friendRequest({
        id: request.id,
        user_id: request.user.id,
        answer,
      });
      getData();
    } catch (err) {
      console.error(err);
    }
  };

  const [startPollingFriendsRequests, cancelPollingFriendsRequests] =
    usePolling(getData, 2000);

  useEffect(() => {
    startPollingFriendsRequests();
    return () => cancelPollingFriendsRequests();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownWrapper
      items={pendingFriendRequests}
      tooltipMessage="Zaproszenia do grona znajomych"
      emptyMessage="Brak zaproszeń do grona znajomych"
      renderItem={(request) => (
        <div
          key={request.user.id}
          className="flex items-center gap-2 p-3 hover:bg-gray-100"
        >
          <img
            src={
              request.user.profile_picture_url || DEFAULT_PROFILE_PICTURE_URL
            }
            alt="Zdjecie profilowe"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <Link
              href={`/user/${request.user.id}`}
              className="text-sm font-medium text-gray-800 hover:underline cursor-pointer"
            >
              {request.user.first_name} {request.user.last_name}
            </Link>
            <div className="flex gap-2 mt-1">
              <button
                className="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => manageFriendRequest(request, true)}
              >
                Akceptuj
              </button>
              <button
                className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => manageFriendRequest(request, false)}
              >
                Odrzuć
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <FontAwesomeIcon icon={faUsers} className="text-gray-700 w-5 h-5" />
      {pendingFriendRequests.length > 0 && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
          {pendingFriendRequests.length}
        </div>
      )}
    </DropdownWrapper>
  );
};

export default PendingFriendRequestsButton;
