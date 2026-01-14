"use client";

export default function MainLayout({ children }) {
  return (
    <main className="min-h-screen bg-sky-50 pt-24 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {children}
      </div>
    </main>
  );
}
