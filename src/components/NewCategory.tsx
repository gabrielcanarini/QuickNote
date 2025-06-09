"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewCategory({
  onCategoryCreated,
}: {
  onCategoryCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const notifyError = () =>
    toast.error("Errore nella creazione della categoria", {
      duration: 5000,
      icon: "🚨",
    });
  const notifyCatExists = () =>
    toast.error("Non puoi avere piú di una categoria con lo stesso nome", {
      duration: 5000,
      icon: "🚨",
    });

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

    const { data: control } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name);
    if (control?.length != 0) {
      notifyCatExists();
      return;
    }

    const { error } = await supabase.from("categories").insert({
      name,
      description,
      user_id: user.id,
    });

    if (error) {
      notifyError();
      return;
    }

    toast.success("Categoria creata!");
    setName("");
    setDescription("");
    onCategoryCreated();
    setOpen(false); // chiudo manualmente il dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
      <DialogTrigger asChild>
        <Button
          className="px-5 py-2 text-base cursor-pointer"
          variant="outline"
        >
          + Nuova categoria
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={newCat}>
          <DialogHeader>
            <DialogTitle>Crea una nuova categoria</DialogTitle>
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
              <Label htmlFor="description">Descrizione</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Aggiungi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
