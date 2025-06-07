"use client";
import CardCategory from "@/components/CardCategory";
import NewCategory from "@/components/NewCategory";
import { Tables } from "@/database.types";
import { createClient } from "@/lib/supabase/client";

import useSWR, { mutate } from "swr";

const fetcher = async () => {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*");
  return data ?? [];
};

export default function Notes() {
  const { data, error, isLoading } = useSWR<Tables<"categories">[]>(
    "categories",
    fetcher
  );
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
        <h1 className="text-3xl font-extrabold">Scegli una categoria</h1>
        <NewCategory onCategoryCreated={() => mutate("categories")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data &&
          data.map((cat) => (
            <CardCategory
              onCategoryDeleted={() => mutate("categories")}
              key={cat.id}
              id={cat.id}
              name={cat.name}
              description={cat.description || ""}
            />
          ))}
      </div>
    </main>
  );
}
