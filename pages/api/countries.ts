import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const countries = JSON.parse(readFileSync('countries.geojson', 'utf-8'));
    return res.json({ countries: countries.features.map(f => f.id) });
  }
}
