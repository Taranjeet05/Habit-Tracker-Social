import API from "./axiosInstance";
import { ApiResponse } from "./axiosInstance";

interface RegisterData {
  userName: string;
  email: string;
  password: string;
}
interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
    profileImage?: string;
    theme: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface UserData {
  message: string;
  token?: string;
  user: {
    _id: string;
    userName: string;
    email: string;
    profileImage?: string;
    theme: string;
  };
}

interface UpdatedData {
  message: string;
  user: {
    friendRequestNotifications?: boolean;
    friendActivityNotifications?: boolean;
    _id?: string;
    userName?: string;
    email?: string;
    profileImage?: string;
    friends?: Array<string>;
    emailNotification?: boolean;
    theme?: string;
  };
}

export const registerUser = async (
  userData: RegisterData
): Promise<RegisterResponse> => {
  const { data } = await API.post<RegisterResponse>(
    "/users/register",
    userData
  );

  return data;
};

export const loginUser = async (
  userData: LoginData
): Promise<ApiResponse<UserData>> => {
  const { data } = await API.post<ApiResponse<UserData>>(
    "/users/login",
    userData
  );
  return data;
};

export const getUserById = async (
  id: string
): Promise<ApiResponse<UserData>> => {
  const { data } = await API.get<ApiResponse<UserData>>(`/users/${id}`);
  return data;
};

export const updateUser = async (
  updatedData: UpdatedData,
  id: string
): Promise<ApiResponse<UpdatedData>> => {
  const { data } = await API.patch<ApiResponse<UpdatedData>>(
    `/users/${id}`,
    updatedData
  );
  return data;
};

export const getUserFriends = async (
  id: string
): Promise<ApiResponse<UserData>> => {
  const { data } = await API.get<ApiResponse<UserData>>(`/users/${id}/friends`);
  return data;
};
