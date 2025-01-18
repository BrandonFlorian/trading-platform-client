"use client";


import { Dashboard } from "@/components/dashboard/dashboard";
import { Header } from "@/components/header";  // Updated import path

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Dashboard />
      </main>
    </>
  );
}