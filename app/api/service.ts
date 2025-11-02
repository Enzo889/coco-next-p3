import { INCategory } from "@/types/category.interface";
import { IPetition } from "@/types/petition.interface";
import { IPostulation } from "@/types/postulation.interface";
import { INotification } from "@/types/notification.interface";
import { IUserInterest } from "@/types/user-interest.interface";
import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const session = await getSession();

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

function authConfig(token?: string): AxiosRequestConfig {
  return token
    ? { headers: { Authorization: `Bearer ${session?.accessToken}` } }
    : {};
}

export const api = {
  // Categories

  getCategories: async (token?: string): Promise<INCategory[]> => {
    const res = await client.get("/category", authConfig(token));
    return res.data;
  },

  getCategory: async (
    id: string | number,
    token?: string
  ): Promise<INCategory> => {
    const res = await client.get(`/category/${id}`, authConfig(token));
    return res.data;
  },

  createCategory: async (
    payload: INCategory,
    token?: string
  ): Promise<INCategory> => {
    const res = await client.post("/category", payload, authConfig(token));
    return res.data;
  },

  updateCategory: async (
    id: string | number,
    payload: Partial<INCategory>,
    token?: string
  ): Promise<INCategory> => {
    const res = await client.put(`/category/${id}`, payload, authConfig(token));
    return res.data;
  },

  deleteCategory: async (
    id: string | number,
    token?: string
  ): Promise<void> => {
    await client.delete(`/category/${id}`, authConfig(token));
  },

  // Notifications

  getNotifications: async (token?: string): Promise<INotification[]> => {
    const res = await client.get("/notifications", authConfig(token));
    return res.data;
  },

  getNotification: async (
    id: string | number,
    token?: string
  ): Promise<INotification> => {
    const res = await client.get(`/notifications/${id}`, authConfig(token));
    return res.data;
  },

  createNotification: async (
    payload: INotification,
    token?: string
  ): Promise<INotification> => {
    const res = await client.post("/notifications", payload, authConfig(token));
    return res.data;
  },

  updateNotification: async (
    id: string | number,
    payload: Partial<INotification>,
    token?: string
  ): Promise<INotification> => {
    const res = await client.patch(
      `/notifications/${id}`,
      payload,
      authConfig(token)
    );
    return res.data;
  },

  deleteNotification: async (
    id: string | number,
    token?: string
  ): Promise<void> => {
    await client.delete(`/notifications/${id}`, authConfig(token));
  },

  // Petitions

  getPetitions: async (token?: string): Promise<IPetition[]> => {
    const res = await client.get("/petition", authConfig(token));
    return res.data;
  },

  getPetition: async (
    id: string | number,
    token?: string
  ): Promise<IPetition> => {
    const res = await client.get(`/petition/${id}`, authConfig(token));
    return res.data;
  },

  createPetition: async (
    payload: IPetition,
    token?: string
  ): Promise<IPetition> => {
    const res = await client.post("/petition", payload, authConfig(token));
    return res.data;
  },

  updatePetition: async (
    id: string | number,
    payload: Partial<IPetition>,
    token?: string
  ): Promise<IPetition> => {
    const res = await client.put(`/petition/${id}`, payload, authConfig(token));
    return res.data;
  },

  deletePetition: async (
    id: string | number,
    token?: string
  ): Promise<void> => {
    await client.delete(`/petition/${id}`, authConfig(token));
  },

  // User-Interest (vincular/desvincular intereses de usuario)
  getUserInterests: async (token?: string): Promise<IUserInterest[]> => {
    const res = await client.get("/user-interest", authConfig(token));
    return res.data;
  },

  getUserInterest: async (
    id: string | number,
    token?: string
  ): Promise<IUserInterest> => {
    const res = await client.get(`/user-interest/${id}`, authConfig(token));
    return res.data;
  },

  addUserInterest: async (
    payload: IUserInterest,
    token?: string
  ): Promise<IUserInterest> => {
    const res = await client.post("/user-interest", payload, authConfig(token));
    return res.data;
  },

  removeUserInterest: async (
    id: string | number,
    token?: string
  ): Promise<void> => {
    await client.delete(`/user-interest/${id}`, authConfig(token));
  },

  // Postulations

  getPostulations: async (token?: string): Promise<IPostulation[]> => {
    const res = await client.get("/postulations", authConfig(token));
    return res.data;
  },

  getPostulation: async (
    id: string | number,
    token?: string
  ): Promise<IPostulation> => {
    const res = await client.get(`/postulations/${id}`, authConfig(token));
    return res.data;
  },

  createPostulation: async (
    payload: IPostulation,
    token?: string
  ): Promise<IPostulation> => {
    const res = await client.post("/postulations", payload, authConfig(token));
    return res.data;
  },

  updatePostulation: async (
    id: string | number,
    payload: Partial<IPostulation>,
    token?: string
  ): Promise<IPostulation> => {
    const res = await client.patch(
      `/postulations/${id}`,
      payload,
      authConfig(token)
    );
    return res.data;
  },

  deletePostulation: async (
    id: string | number,
    token?: string
  ): Promise<void> => {
    await client.delete(`/postulations/${id}`, authConfig(token));
  },

  // utility: request with custom method (opcional) — genérico para autocompletado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: async <T = any>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    token?: string
  ): Promise<T> => {
    const config = { ...authConfig(token) };
    const res = await client.request({ method, url, data, ...config });
    return res.data as T;
  },
};

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - NextAuth maneja esto automáticamente
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
    group: number;
  }) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    const { data } = await axiosInstance.post("/auth/register", userData);
    return data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get("/auth/profile");
    return data;
  },
};

export const chatApi = {
  getConversations: async () => {
    const { data } = await axiosInstance.get("/chat/conversations");
    return data;
  },

  getConversation: async (otherUserId: number) => {
    const { data } = await axiosInstance.get(
      `/chat/conversation/${otherUserId}`
    );
    return data;
  },

  getUnreadMessages: async () => {
    const { data } = await axiosInstance.get("/chat/unread");
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await axiosInstance.get("/chat/unread/count");
    return data;
  },

  markAsRead: async (otherUserId: number) => {
    const { data } = await axiosInstance.post(`/chat/mark-read/${otherUserId}`);
    return data;
  },

    sendMessage: async (payload: {
    receiverId: number;
    content: string;
    petitionId?: number;
  }) => {
    const { data } = await axiosInstance.post("/chat/send", payload);
    return data;
  },

  
};

export const usersApi = {
  getUsers: async () => {
    const { data } = await axiosInstance.get("/users");
    return data;
  },

  getUser: async (id: number) => {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  },
};
