"use client";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.refresh();
  }

  useEffect(() => {
    const u = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user?.id);
    };
    u();
  }, []);

  return (
    <div>
      HOME <Link href={"/login"}>Login Page</Link>
      <button onClick={signOut}>SognOut</button>
      <Link href={"/notes"}>Notes</Link>
    </div>
  );
}
