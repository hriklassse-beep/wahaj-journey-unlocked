import { createFileRoute } from "@tanstack/react-router";
import { WahajExperience } from "@/components/wahaj/WahajExperience";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <WahajExperience />;
}
