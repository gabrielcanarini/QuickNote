"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CardCategory({
  id,
  name,
  description,
  onCategoryDeleted,
}: {
  id: string;
  name: string;
  description: string;
  onCategoryDeleted: () => void;
}) {
  const notifyError = () =>
    toast.error("Errore nella cancellazione della categoria", {
      duration: 5000,
      icon: "🚨",
    });
  const notifySuccess = () =>
    toast.success(`${name} eliminata`, {
      duration: 5000,
    });
  return (
    <Card className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Button
        onClick={async () => {
          const supabase = createClient();
          const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);
          if (error) {
            notifyError();
          } else {
            notifySuccess();
          }
          onCategoryDeleted();
        }}
        className="cursor-pointer absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
        aria-label={`Elimina categoria ${name}`}
        title="Elimina categoria"
        variant="ghost"
      >
        🗑️
      </Button>

      <CardHeader>
        <CardTitle className="text-xl font-semibold line-clamp-2">
          {name.toUpperCase()}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
          {description}
        </p>
        <div className="mt-auto">
          <Link href={`/categories/${name}`}>
            <Button
              className="w-full border-2 cursor-pointer"
              variant="secondary"
            >
              Apri
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
