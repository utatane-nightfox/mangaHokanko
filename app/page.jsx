"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client";
import Header from "@/components/Header";
import MangaTable from "@/components/MangaTable";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [mangas, setMangas] = useState([]);

  const load = async () => {
    const { data: auth } = await supabase.auth.getSession();
    if (!auth.session) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("mangas")
      .select("*")
      .eq("user_id", auth.session.user.id)
      .order("created_at", { ascending: false });

    setMangas(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Header />
      <main className="p-6">
        <MangaTable mangas={mangas} reload={load} />
      </main>
    </>
  );
}
