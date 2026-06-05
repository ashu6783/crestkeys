import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IUser {
  _id?: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  createdAt?: string;
  accountType?: "owner" | "buyer" | "agent" | "admin";
}

export interface IloginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  accountType?: "owner" | "buyer" | "agent" | "admin";
  createdAt: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  accountType?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  accountType: string;
}

export interface IPost {
  _id: string;
  userId: string | IUser;
  title: string;
  price: number;
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  type: "rent" | "buy" | "vacation";
  property: "apartment" | "house" | "condo" | "land";
  latitude: number;
  longitude: number;
  images: string[];
  postDetail?: IPostDetail;
}

export interface IPostDetail {
  _id?: string;
  desc: string;
  utilities?: "included" | "excluded" | "shared";
  pet?: "allowed" | "not_allowed" | "case_by_case";
  income?: "no" | "yes";
  size?: number;
  school?: number;
  bus?: number;
  restaurant?: number;
  postId: string;
}

export interface ISavedPost {
  _id?: string;
  userId: string;
  postId: string;
  createdAt?: string;
}

export interface ProfilePostsResponse {
  userPosts: IPost[];
  savedPosts: IPost[];
}

// ----------------- Utils -----------------
export const toQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.append(key, value.toString());
  });
  return searchParams.toString();
};


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User", "Post", "PostDetail", "SavedPost"],
  endpoints: (builder) => ({

    getPosts: builder.query<IPost[], Record<string, string | number | undefined>>({
      query: (filters) => `/posts?${toQueryString(filters)}`,
      providesTags: ["Post"],
    }),
    getPostById: builder.query<IPost, string>({
      query: (id) => `/posts/${id}`,
      providesTags: ["Post"],
    }),
    getProfilePosts: builder.query<ProfilePostsResponse, void>({
      query: () => `/users/profilePosts`,
      providesTags: ["Post"],
    }),


    login: builder.mutation<ILoginResponse, IloginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<UserResponse, RegisterRequest>({
      query: (newUser) => ({
        url: "/auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});


export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetProfilePostsQuery,
  useLoginMutation,
  useRegisterMutation,
} = api;
