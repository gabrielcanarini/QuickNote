"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { data, error, isLoading } = useSWR("user", getUser);
  const router = useRouter();
  const { setTheme } = useTheme();
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

  async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.refresh();
  }

  return (
    <section className="py-4">
      <nav className="relative flex items-center justify-between px-4">
        {/* destra */}
        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  {data?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>{data?.email}</DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link href={"/profile"}>Profilo</Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Chiaro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Scuro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      Sistema
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo al centro */}
        <span className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold tracking-tighter">
          <Link href={"/"}>QuickNote</Link>
        </span>
      </nav>
    </section>
  );
}

const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
