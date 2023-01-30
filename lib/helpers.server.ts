import { AlertingAuthority } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import redis from "./redis";

export const fetchWMOAlertingAuthorities = async () => {
  const redisKey = `wmoRegisterAlertingAuthorities`;
  const cachedData = await redis.GET(redisKey);
  if (cachedData) return JSON.parse(cachedData) as AlertingAuthority[];

  const result = await fetch("https://alertingauthority.wmo.int/rss.xml").then(
    (res) => res.text()
  );

  const parser = new XMLParser();
  const alertingAuthorities = parser.parse(result);

  const data = alertingAuthorities.rss.channel.item.map((i: any) => ({
    name: i.title,
    id: i.guid,
    author: i.author,
    countryCode: i["iso:countrycode"],
    polygon: i["cap:area"]?.["cap:polygon"],
  }));

  // Cache WMO Register of AAs data for a country for 24 hours
  redis.SET(redisKey, JSON.stringify(data), { EX: 60 * 60 * 24 });

  return data as AlertingAuthority[];
};
