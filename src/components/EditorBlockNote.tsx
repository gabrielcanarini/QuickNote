"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useRef, JSX } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Tables } from "@/database.types";
import useSWR, { mutate } from "swr";
import { useTheme } from "next-themes";

export default function Editor({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR<Tables<"notes"> | null>(
    id,
    fetcher,
    {
      revalidateOnMount: true,
    }
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleContentChange = async (editorInstance: BlockNoteEditor) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log("Salvataggio automatico dopo 5 secondi di inattività");
      save(JSON.stringify(editorInstance.document), id);
      mutate(id);
    }, 2000);
  };

  return (
    <TextEditor content={data?.content_md || ""} handle={handleContentChange} />
  );
}

type TextEditorProps = {
  content: string;
  handle: (editorInstance: BlockNoteEditor) => Promise<void>;
};

function TextEditor({ content, handle }: TextEditorProps): JSX.Element {
  const editor = useCreateBlockNote({
    initialContent: JSON.parse(content),
  });
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <BlockNoteView
      editor={editor}
      onChange={handle}
      theme={currentTheme === "light" ? "light" : "dark"}
    />
  );
}

const fetcher = async (id: string): Promise<Tables<"notes"> | null> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};

const save = async (content: string, id_note: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("notes")
    .update({ content_md: content })
    .eq("id", id_note);
  if (error) {
    toast.error("errore nel salvataggio", {
      duration: 2000,
      position: "bottom-right",
    });
  }
};
