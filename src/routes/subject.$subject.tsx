import { createFileRoute, Outlet } from "@tanstack/react-router";
import { isSubjectId } from "@/data/catalog";

export const Route = createFileRoute("/subject/$subject")({
  beforeLoad: ({ params }) => {
    if (!isSubjectId(params.subject)) {
      throw new Error("Unknown subject");
    }
  },
  component: SubjectLayout,
});

function SubjectLayout() {
  return <Outlet />;
}
