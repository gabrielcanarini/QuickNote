"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: dataForm.email,
      password: dataForm.password,
    });

    if (error) {
      setIsError(true);
    } else if (data) {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Registrati a Quick Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={signup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={dataForm.email}
                  onChange={(e) =>
                    setDataForm({ ...dataForm, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={dataForm.password}
                  onChange={(e) =>
                    setDataForm({ ...dataForm, password: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Iscrizione in corso..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Hai già un account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Accedi
              </Link>
            </div>
            {isError && (
              <div className="mt-4 text-center text-sm text-red-500">
                Errore nella registrazione.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
