"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/utils/supabase/client";

export default function UserHeader() {
  const supabase = supabaseBrowser();
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };

    loadUser();
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const filePath = `${user.id}-${Date.now()}.png`;

    await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    setAvatarUrl(publicUrl);
  };

  return (
    <div className="flex items-center gap-3">
      <label className="cursor-pointer">
        <Image
          src={avatarUrl}
          alt="user icon"
          width={40}
          height={40}
          className="rounded-full border"
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </label>
    </div>
  );
}
