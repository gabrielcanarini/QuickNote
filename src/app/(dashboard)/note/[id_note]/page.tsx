"use client";
import Editor from "@/components/EditorBlockNote";
import { use } from "react";

export default function NotePage({
  params,
}: {
  params: Promise<{ id_note: string }>;
}) {
  const { id_note } = use(params);

  return (
    <div>
      <Editor id={id_note} />
    </div>
  );
}
