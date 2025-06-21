"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { MultiSelect } from "@/components/ui/multi-select-type-note";

export default function NewNote({
  onNoteCreated,
  nameCat,
}: {
  onNoteCreated: () => void;
  nameCat: string;
}) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [typeNote, setTypeNote] = useState<string[]>([]);

  const notifyError = () =>
    toast.error("Errore nella creazione della nota", {
      duration: 5000,
      icon: "🚨",
    });
  const notifyCatExists = () =>
    toast.error(
      "Non puoi avere piú di una nota con lo stesso nome nella stessa categoria",
      {
        duration: 5000,
        icon: "🚨",
      }
    );

  const newCat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      notifyError();
      return;
    }

    const { data: cat, error: catError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", nameCat)
      .eq("user_id", user.id)
      .single();

    if (catError) {
      notifyError();
      return;
    }
    const initialContent = [
      {
        type: "heading",
        level: 1, // level come proprietà diretta, non dentro props
        content: [
          {
            type: "text",
            text: `${name.toUpperCase()}`,
          },
        ],
      },
      {
        type: "paragraph",
        content: [],
      },
    ];

    const { data: dataNote, error } = await supabase
      .from("notes")
      .insert({
        title: name.toLowerCase(),
        cat_id: cat!.id,
        content_md: JSON.stringify(initialContent),
        user_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        notifyCatExists();
        return;
      }
      notifyError();
      return;
    }

    typeNote.forEach(async (type) => {
      await supabase.from("n_type").insert({
        note_id: dataNote.id,
        type_id: type,
      });
    });

    toast.success("Nota creata!");
    setName("");
    setOpen(false);
    onNoteCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="px-5 py-2 text-base cursor-pointer"
          variant="outline"
        >
          + Nuova nota
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={newCat}>
          <DialogHeader>
            <DialogTitle>Crea una nuova nota</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Tipo</Label>
              <MultiSelect
                onValueChange={setTypeNote}
                placeholder="Tipo nota"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Crea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
