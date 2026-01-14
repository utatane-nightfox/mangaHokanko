"use client";

export default function MainLayout({ title, children }) {
  return (
    <main className="min-h-screen bg-sky-50 pt-24 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-sky-700">{title}</h1>
        <div className="bg-white rounded-2xl shadow p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
