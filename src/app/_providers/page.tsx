// app/cloud-provider/page.tsx

import CloudProvider from "@/components/CloudProvider";
import { readFile } from "fs/promises";
import path from "path";

const CLOUD_API_URL = "https://node-server-51e8.vercel.app/api/clouds";
const GEOJSON_LOCAL_PATH = path.join(
  process.cwd(),
  "public/datasets/cloud_regions.geojson"
);

export const dynamic = "force-static"; // Enable full static generation (SSG)

async function CloudProviderPagex() {
  // Fetch cloud API with revalidation
  const cloudRes = await fetch(CLOUD_API_URL, {
    next: { revalidate: 86400 }, // Cache for 1 day
  });

  const cloudData = cloudRes.ok ? await cloudRes.json() : null;

  // Load local geojson file
  const geojsonRaw = await readFile(GEOJSON_LOCAL_PATH, "utf-8");
  const geojsonData = JSON.parse(geojsonRaw);

  const features =
    cloudData?.features?.length > 0 ? cloudData.features : geojsonData.features;

  return <CloudProvider initialRegions={features} />;
}
export { CloudProviderPagex };
