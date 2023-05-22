/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from "axios";

import { User } from "./types/User";
import { NewUser } from "./types/NewUser";

const axiosInstance = axios.create({
  baseURL: "https://union-39c6f-default-rtdb.firebaseio.com/",
});

const FirebaseAPI = {
  fetchUsers: async () => axiosInstance.get<User[]>("users.json"),

  addPermission: async (id: string, permission: string[]) => {
    const data = axiosInstance.post(`users/${id}.json`, permission);
    return data;
  },

  addUser: async ({ name, email, permissions, image }: NewUser) => {
    axiosInstance.post<User>("users.json", {
      name,
      email,
      permissions,
      image,
    });
  },

  changePermissions: async (id: string, permissions: string[]) => {
    axiosInstance
      .put(`users/${id}/permissions.json`, permissions)
      .then(() => {
        console.log("Элемент успешно добавлен в массив данных");
      })
      .catch((error) => {
        console.error("Ошибка при добавлении элемента в массив данных", error);
      });
  },

  deleteUser: async (id: string) => axiosInstance.delete(`users/${id}.json`),
};

export { FirebaseAPI };
