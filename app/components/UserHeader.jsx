"use client";

export default function UserHeader({ user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <img
        src="/avatar.png"
        alt="avatar"
        width={40}
        height={40}
        style={{ borderRadius: "50%" }}
      />
      <span>{user.email}</span>
    </div>
  );
}
