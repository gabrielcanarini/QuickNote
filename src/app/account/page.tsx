"use client";
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
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { deleteAccount } from "@/lib/supabase/deleteAccount";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function AccountPage() {
  const { data, error, isLoading } = useSWR("user", fetcher);
  const [isAlterOpen, setIsAlterOpen] = useState(false);
  const router = useRouter();

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
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col justify-between mb-6 space-y-2">
        <h1 className="text-3xl font-extrabold">{data?.email}</h1>
        <AlertDialog open={isAlterOpen} onOpenChange={setIsAlterOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="cursor-pointer top-3 right-3 text-red-500 hover:text-red-700 transition-colors w-fit"
              aria-label={`Elimina account`}
              title="Elimina categoria"
            >
              Cancella account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
              <AlertDialogDescription>
                L&apos;azione non é reversibile. Perderai tutte le tue note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  className="text-white bg-red-500 cursor-pointer"
                  onClick={() => {
                    deleteAccount(data!.id);
                    router.refresh();
                  }}
                >
                  Cancella account
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}

const fetcher = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
