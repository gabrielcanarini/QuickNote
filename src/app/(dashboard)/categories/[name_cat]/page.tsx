"use client";
import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

import useSWR from "swr";

export default function CatPage({
  params,
}: {
  params: Promise<{ name_cat: string }>;
}) {
  const { name_cat } = use(params);

  const { data, error, isLoading } = useSWR<Tables<"notes">[]>(
    name_cat,
    fetcher
  );
  console.log(data);
  return <div>{name_cat}</div>;
}

const fetcher = async (cat) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .select("*, categories(name)")
    .eq("user_id", await getUserId())
    .eq("categories.name", cat);
  return data ?? [];
};

const getUserId = async (): Promise<string> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user!.id || "";
};
