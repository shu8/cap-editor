import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "../../lib/apiErrorHandler";

async function handleGetRegions(req: NextApiRequest, res: NextApiResponse) {
  const { countryCode } = req.query;
  if (!countryCode) return res.redirect("/all-countries.geojson");

  const regions = JSON.parse(
    readFileSync("public/all-countries.geojson", "utf-8")
  );
  const matchedRegions = [];
  for (let i = 0; i < regions.features.length; i++) {
    if (regions.features[i].properties.ISO_A3 === countryCode) {
      matchedRegions.push(regions.features[i]);
    }
  }

  return res.json({
    type: "FeatureCollection",
    features: matchedRegions,
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetRegions(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
