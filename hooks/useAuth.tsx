import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthCtx } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { register, login, logout, refreshToken, getUserData } from "../api/api";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data: any) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });
}

export function useLogin() {
  const { loginHandler } = useAuthCtx();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      loginHandler(data.data.tokens, data.data.user);
      queryClient.setQueryData(["user"], data.user);
      router.push("/");
    },
  });
}

export function useLogout() {
  const { logoutHandler } = useAuthCtx();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logoutHandler();
      queryClient.clear();
    },
  });
}

export function useRefreshToken() {
  const { refreshTokenHandler } = useAuthCtx();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data: any) => {
      console.log(data);
      refreshTokenHandler(data.data.tokens);
    },
  });
}

export function useGetUserData() {
  return useQuery({ queryKey: ["getUserData"], queryFn: getUserData });
}
