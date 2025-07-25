// app/cloud-provider/page.tsx

import CloudProvider from "@/components/CloudProvider";
import CryptoGlobe from "@/components/CryptoGlobe";
import GlobeComponent from "@/components/GlobeComponent";
import { readFile } from "fs/promises";
import path from "path";

const BASE_API_URL = "https://node-server-51e8.vercel.app/api";
export const dynamic = "force-static";

async function CloudProviderPagex() {
  const CLOUD_API_URL = "https://node-server-51e8.vercel.app/api/clouds";
  const GEOJSON_LOCAL_PATH = path.join(
    process.cwd(),
    "public/datasets/cloud_regions.geojson"
  );

  const cloudRes = await fetch(CLOUD_API_URL, {
    next: { revalidate: 3600 },
  });

  const cloudData = cloudRes.ok ? await cloudRes.json() : null;

  // Load local geojson file
  const geojsonRaw = await readFile(GEOJSON_LOCAL_PATH, "utf-8");
  const geojsonData = JSON.parse(geojsonRaw);

  const features =
    cloudData?.features?.length > 0 ? cloudData.features : geojsonData.features;

  return <CloudProvider initialRegions={features} />;
}

async function CryptoGlobePage() {
  let geojsonData: any = null;
  let citiesData: any = null;

  try {
    const [geojsonRes, citiesRes] = await Promise.all([
      fetch(`${BASE_API_URL}/countries`, { next: { revalidate: 3600 } }),
      fetch(`${BASE_API_URL}/cities`, { next: { revalidate: 3600 } }),
    ]);

    geojsonData = geojsonRes.ok ? await geojsonRes.json() : null;
    citiesData = citiesRes.ok ? await citiesRes.json() : null;
  } catch (error) {
    console.error("API fetch error:", error);
  }

  // If API failed, fallback to local files
  if (!geojsonData?.features?.length) {
    try {
      const geojsonRaw = await readFile(
        path.join(
          process.cwd(),
          "/datasets/modified_crypto_exchange_countries.geojson"
        ),
        "utf-8"
      );
      geojsonData = JSON.parse(geojsonRaw);
    } catch (err) {
      console.error("Failed to load fallback geojson file:", err);
      geojsonData = { features: [] };
    }
  }

  if (!citiesData?.length) {
    try {
      const citiesRaw = await readFile(
        path.join(process.cwd(), "/datasets/searchable_cities.json"),
        "utf-8"
      );
      citiesData = JSON.parse(citiesRaw);
    } catch (err) {
      console.error("Failed to load fallback cities file:", err);
      citiesData = [];
    }
  }

  return (
    <CryptoGlobe
      initialRegions={geojsonData?.features || []}
      initialCities={citiesData || []}
    />
  );
}
async function PopulatedGlobePage() {
  let populatedData: any = null;

  try {
    const res = await fetch(`${BASE_API_URL}/populated`, {
      next: { revalidate: 3600 },
    });
    populatedData = res.ok ? await res.json() : null;
  } catch (error) {
    console.error("API fetch failed for /populated:", error);
  }

  if (!populatedData?.features?.length) {
    try {
      const localRaw = await readFile(
        path.join(
          process.cwd(),
          "public/datasets/ne_110m_populated_places_simple.geojson"
        ),
        "utf-8"
      );
      populatedData = JSON.parse(localRaw);
    } catch (error) {
      console.error(
        "Local fallback failed for populated cities geojson:",
        error
      );
      populatedData = { features: [] };
    }
  }

  return <GlobeComponent initialPlaces={populatedData?.features || []} />;
}

export { CloudProviderPagex, CryptoGlobePage, PopulatedGlobePage };
