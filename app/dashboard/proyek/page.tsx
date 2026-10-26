import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = { title: "Proyek" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
