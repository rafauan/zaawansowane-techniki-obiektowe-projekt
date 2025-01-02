import { IUser } from "./user";

interface IFriendBase {
  id: number;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
}

export interface IFriend extends IFriendBase {
  friend: IUser;
}

export interface IFriendRequest extends IFriendBase {
  user: IUser;
}

export interface GetFriendsResponse {
  message: string;
  friends: IFriend[];
}

export interface GetPendingFriendRequestsResponse {
  message: string;
  pending_requests: IFriendRequest[];
}

export interface AddFriendResponse {
  message: string;
}

export interface ManageFriendRequestResponse {
  message: string;
}
