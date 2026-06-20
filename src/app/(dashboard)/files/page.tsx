import { FileManager } from "@/components/files/file-manager";
import { PageHeading } from "@/components/shared/page-heading";
import { listDirectory } from "@/lib/files";

export default async function FileManagerPage() {
  const listing = await listDirectory("");

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Workspace browser"
        title="File Manager"
        description="Browse the project workspace through a safe server-side file API scoped to this application root."
      />
      <FileManager initialListing={listing} />
    </div>
  );
}
