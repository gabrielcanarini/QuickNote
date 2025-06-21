"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { NoteWithTypes } from "@/app/(dashboard)/categories/[name_cat]/page";
import { Badge } from "./ui/badge";

export default function CardNote({
  noteData,
  onNoteDeleted,
}: {
  noteData: NoteWithTypes;
  onNoteDeleted: () => void;
}) {
  const [isAlterOpen, setIsAlterOpen] = useState<boolean>(false);

  const notifyError = () =>
    toast.error("Errore nella cancellazione della nota", {
      duration: 5000,
      icon: "🚨",
    });
  const notifySuccess = () =>
    toast.success(`${noteData.title} eliminata`, {
      duration: 5000,
    });
  return (
    <Card className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <AlertDialog open={isAlterOpen} onOpenChange={setIsAlterOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
            aria-label={`Elimina categoria ${noteData.title}`}
            title="Elimina categoria"
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              L&apos;azione non é reversibile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancella</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="text-white bg-red-500"
                onClick={async () => {
                  const supabase = createClient();
                  const { error } = await supabase
                    .from("notes")
                    .delete()
                    .eq("id", noteData.id);
                  if (error) {
                    notifyError();
                  } else {
                    notifySuccess();
                  }
                  onNoteDeleted();
                  setIsAlterOpen(false);
                }}
              >
                Continua
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader>
        <CardTitle className="text-xl font-semibold line-clamp-2">
          {noteData.title.toUpperCase()}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow gap-2">
        <div className="flex-flex-col items-center space-x-2">
          {noteData.n_type.map((e) => {
            return <Badge key={e.note_types.id}>{e.note_types.name}</Badge>;
          })}
        </div>
        <div className="mt-auto">
          <Link href={`/note/${noteData.id}`}>
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
