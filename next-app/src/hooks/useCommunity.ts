"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase/client";
import { rpc } from "@/lib/backend";
import { useInternetIdentity } from "./useInternetIdentity";
export type Group = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  group_members: { user_id: string }[];
};
export type Reply = {
  id: number;
  body: string;
  created_at: string;
  alias: string;
  mine: boolean;
};
export type Post = Reply & {
  anonymous: boolean;
  likes: number;
  liked: boolean;
  replies: Reply[];
};
export function useGroups() {
  const { user } = useInternetIdentity();
  return useQuery({
    queryKey: ["groups", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from("groups")
        .select("id,slug,name,description,category,group_members(user_id)")
        .order("name");
      if (error) throw error;
      return data as Group[];
    },
  });
}
export function useFeed(group: number | null) {
  const { user } = useInternetIdentity();
  return useInfiniteQuery({
    queryKey: ["feed", user?.id, group],
    enabled: !!user,
    initialPageParam: null as number | null,
    queryFn: async ({ pageParam }) =>
      (await rpc("get_feed", {
        p_group: group,
        p_before: pageParam,
        p_limit: 20,
      })) as Post[],
    getNextPageParam: (last) =>
      last.length === 20 ? last[last.length - 1].id : undefined,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });
}
export function useCommunityAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      args,
    }: {
      name: string;
      args: Record<string, unknown>;
    }) => rpc(name, args),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["feed"] }),
        qc.invalidateQueries({ queryKey: ["groups"] }),
        qc.invalidateQueries({ queryKey: ["notifications"] }),
      ]);
    },
  });
}
