import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import redis from "../../lib/redis";
import { authOptions } from "./auth/[...nextauth]";

async function handleGetWhatNowMessages(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.countryCode) {
    throw new ApiError(400, 'You did not supply a country code');
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(403, 'You are not logged in');

  const redisKey = `whatnow:${req.query.countryCode}`;
  const cachedData = await redis.GET(redisKey);
  if (cachedData) return res.json({ data: JSON.parse(cachedData) });

  const data = await fetch(`https://api.preparecenter.org/v1/org/${req.query.countryCode}/whatnow`, {
    headers: { 'x-api-key': process.env.WHAT_NOW_API_KEY }
  }).then(res => res.json());

  // Cache WhatNow data for a country for 24 hours
  redis.SET(redisKey, JSON.stringify(data.data), { EX: 60 * 60 * 24 });

  return res.json({ data: data.data });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return handleGetWhatNowMessages(req, res);
  return res.status(405).send('Method not allowed');
}

export default withErrorHandler(handler);
