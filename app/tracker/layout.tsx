import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker de candidatures | Suivez vos candidatures | CVpass",
  description: "Suivez toutes vos candidatures en un seul endroit. Tableau Kanban, notes, rappels.",
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
