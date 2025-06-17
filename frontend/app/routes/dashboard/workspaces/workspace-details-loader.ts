// src/loaders/workspace-details-loader.ts
import { fetchData } from "@/lib/fetch-util";

export async function workspaceDetailsLoader({ params }: any) {
  const { workspaceId } = params;

  if (!workspaceId) {
    throw new Response("Workspace ID is required", { status: 400 });
  }

  const data = await fetchData(`/workspaces/${workspaceId}`);

  // Just return raw data to avoid issues with `json()` import
  return data;
}
