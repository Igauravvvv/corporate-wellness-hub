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

const FALLBACK_GROUPS: Group[] = [
  {
    id: 1,
    slug: "cricket",
    category: "sports",
    name: "Cricket",
    description: "Find a team. Plan your next match.",
    group_members: [],
  },
  {
    id: 2,
    slug: "football",
    category: "sports",
    name: "Football",
    description: "Find a five-a-side team or plan a weekend kickabout.",
    group_members: [],
  },
  {
    id: 3,
    slug: "badminton",
    category: "sports",
    name: "Badminton",
    description: "Friendly rallies, court reservations, and doubles partners.",
    group_members: [],
  },
  {
    id: 4,
    slug: "health-wellness",
    category: "wellbeing",
    name: "Health & wellness",
    description: "Build better habits together.",
    group_members: [],
  },
  {
    id: 5,
    slug: "mindfulness",
    category: "wellbeing",
    name: "Mindfulness",
    description: "Share simple ways to slow down and reset.",
    group_members: [],
  },
  {
    id: 6,
    slug: "yoga",
    category: "wellbeing",
    name: "Yoga",
    description: "Stretch, breathe and build a practice together.",
    group_members: [],
  },
  {
    id: 7,
    slug: "music",
    category: "arts",
    name: "Music",
    description: "Share playlists and discover new sounds.",
    group_members: [],
  },
  {
    id: 8,
    slug: "study-circles",
    category: "learning",
    name: "Study circles",
    description: "Find study partners, share resources and learn together.",
    group_members: [],
  },
  {
    id: 9,
    slug: "coffee-chats",
    category: "social",
    name: "Coffee chats",
    description: "Make time for a coffee and a new connection.",
    group_members: [],
  },
  {
    id: 10,
    slug: "hiking",
    category: "outdoors",
    name: "Hiking",
    description: "Discover local trails and plan a walk with good company.",
    group_members: [],
  },
];

export function useGroups() {
  const { user } = useInternetIdentity();
  return useQuery({
    queryKey: ["groups", user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await getSupabase()
          .from("groups")
          .select("id,slug,name,description,category,group_members(user_id)")
          .order("name");
        if (error) throw error;
        if (data && data.length > 0) return data as Group[];
      } catch (e) {
        console.warn("Using fallback groups:", e);
      }
      return FALLBACK_GROUPS;
    },
  });
}

export function useFeed(group: number | null) {
  const { user } = useInternetIdentity();
  return useInfiniteQuery({
    queryKey: ["feed", user?.id, group],
    enabled: !!user,
    initialPageParam: null as number | null,
    queryFn: async ({ pageParam }) => {
      try {
        const res = (await rpc("get_feed", {
          p_group: group,
          p_before: pageParam,
          p_limit: 20,
        })) as Post[];
        if (Array.isArray(res) && res.length > 0) return res;
      } catch (e) {
        console.warn("Feed query fallback:", e);
      }
      return [
        {
          id: 1,
          body: "Anyone up for a lunchtime mindful walk this week?",
          created_at: new Date().toISOString(),
          alias: "Alex Chen",
          mine: false,
          anonymous: false,
          likes: 3,
          liked: false,
          replies: [],
        },
      ];
    },
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
