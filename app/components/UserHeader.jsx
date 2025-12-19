"use client";

export default function UserHeader({ user, avatarUrl }) {
  return (
    <header style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <img
        src={avatarUrl || "/avatar.png"}
        alt="avatar"
        width={40}
        height={40}
        style={{ borderRadius: "50%" }}
      />
      <span>{user?.email ?? "ゲスト"}</span>
    </header>
  );
}
