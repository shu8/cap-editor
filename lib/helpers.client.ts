import React, { EffectCallback, useEffect } from "react";
import timezones from "timezones.json";

export const classes = (...args: any) =>
  args.filter((c: string) => !!c).join(" ");

export const getStartOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getEndOfYesterday = () => {
  const date = getStartOfToday();
  date.setMinutes(date.getMinutes() - 1);
  return date;
};

export const updateState = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  data: any
) => {
  setter((old: any) => ({ ...old, ...data }));
};

export const camelise = (str: string) => {
  const words = str.toLowerCase().split(" ");
  let ret = words[0];
  for (let i = 1; i < words.length; i++) {
    ret += words[i][0].toUpperCase() + words[i].substring(1);
  }
  return ret;
};

export const fetcher = (...args: any) =>
  fetch(...args).then((res) => res.json());

// In part, from https://stackoverflow.com/a/17415677
// Basically: format the Date as-is as YYYY-MM-DDThh:mm:ss and append "+hh:mm" as per the specified timezone
export const formatDate = (date: Date, timezone: string = "Etc/GMT") => {
  const offset = timezones.find((t) => t.utc.includes(timezone))!.offset;
  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    (offset < 0 ? "-" : "+") +
    pad(Math.floor(Math.abs(offset))) +
    ":" +
    (offset % 0.5 === 0 ? "30" : "00")
  );
};

export class HandledError extends Error {
  constructor(message: string, ...params) {
    super(...params);
    this.name = "HandledError";
    this.message = message;
  }
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (fn: EffectCallback) => useEffect(fn, []);
