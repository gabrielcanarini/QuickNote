"use client";
import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

import useSWR from "swr";

type NoteWithTypes = Tables<"notes"> & {
  n_type: {
    note_types: Tables<"note_types">[];
  }[];
};

export default function CatPage({
  params,
}: {
  params: Promise<{ name_cat: string }>;
}) {
  const { name_cat } = use(params);
  const { data, error, isLoading } = useSWR(name_cat, fetcherNota);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error.message}
      </div>
    );
  }

  console.log(data);
  return <div>{name_cat}</div>;
}

const fetcherNota = async (cat: string) => {
  const supabase = createClient();
  const userId = await getUserId();
  const categoryName = cat;

  const { data, error } = await supabase
    .from("notes")
    .select(
      `
    *,
    categories!inner(name),
    n_type (
      note_types:note_types (*)
    )
  `
    )
    .eq("user_id", userId)
    .eq("categories.name", categoryName.toLowerCase());

  if (error) {
    return [];
  }

  const notesWithTypes = (data as NoteWithTypes[]).map((note) => ({
    ...note,
    types: note.n_type.map((nt) => nt.note_types),
  }));

  console.log(notesWithTypes);
  return notesWithTypes ?? [];
};

const getUserId = async (): Promise<string> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user!.id || "";
};
