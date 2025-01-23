import apiClient from "../lib/axios";
import { type Credentials, type UpdatePlayerPayload } from "../types/types";

export const register = async function (credentials: Credentials) {
  const data = await apiClient.post("/register", credentials);
  return data;
};

export const login = async function (credentials: Credentials) {
  const data = await apiClient.post("/login", credentials);
  return data;
};

export const logout = async function () {
  const data = await apiClient.post("/logout");
  return data;
};

export const refreshToken = async function (refreshToken: string) {
  const data = await apiClient.post("/refresh-token", { refreshToken });
  return data;
};

export const getUserData = async function () {
  const data = await apiClient.get("/profile");
  console.log(data);
  return data;
};

export const getPlayers = async function () {
  const data = await apiClient.get("/players");
  return data;
};

export const updatePlayer = async function (player: UpdatePlayerPayload) {
  const payload: UpdatePlayerPayload = { playerId: player.playerId };

  if (player.price) payload.price = player.price;
  if (player.isMarketListed !== undefined) {
    payload.isMarketListed = player.isMarketListed;
  }

  const data = await apiClient.put("/player", payload);
  return data;
};

export const buyPlayer = async function (playerId: number) {
  const data = await apiClient.post("/players/buy", { playerId });
  return data;
};
