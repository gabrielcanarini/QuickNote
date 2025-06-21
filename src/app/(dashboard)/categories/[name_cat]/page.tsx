"use client";
import CardNote from "@/components/CardNote";
import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";
import NewNote from "@/components/NewNote";

import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type NoteWithTypes = Tables<"notes"> & {
  n_type: {
    note_types: Tables<"note_types">;
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

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">Scegli una nota</h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/categories">Torna alle categorie</Link>
          </Button>
          <NewNote onNoteCreated={() => mutate(name_cat)} nameCat={name_cat} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data &&
          data.map((e) => {
            return (
              <CardNote
                key={e.id}
                noteData={e}
                onNoteDeleted={() => mutate(name_cat)}
              />
            );
          })}
      </div>
    </main>
  );
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
