import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "../../lib/apiErrorHandler";

async function handleGetCountries(req: NextApiRequest, res: NextApiResponse) {
  const countries = JSON.parse(readFileSync('countries.geojson', 'utf-8'));
  if (req.query.countryCode) {
    return res.json({ countries: countries.features.filter(f => f.properties.ISO_A3 === req.query.countryCode).map(f => f.id) });
  }
  return res.json({ countries: countries.features.map(f => f.id) });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetCountries(req, res);
  }

  return res.status(405);
}

export default withErrorHandler(handler);
