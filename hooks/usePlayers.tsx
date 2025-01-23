import { buyPlayer, getPlayers, updatePlayer } from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useGetPlayers() {
  return useQuery({ queryKey: ["getPlayers"], queryFn: getPlayers });
}

export function useBuyPlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buyPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserData"] });
      queryClient.invalidateQueries({ queryKey: ["getPlayers"] });
    },
  });
}
