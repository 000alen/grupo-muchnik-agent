import Source from "@/components/custom/source";
import NewSourceButton from "@/components/custom/new-source-button";
import { createAsyncCaller } from "@/trpc/routers/app";

export default async function SourcesPage() {
  const trpc = await createAsyncCaller();
  const sources = await trpc.sources.getAll();

  return (
    <div className="container-custom space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sources</h1>
        <NewSourceButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <Source key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
} 