import { EffectCallback, useEffect } from "react";

export const classes = (...args) => args.filter((c) => !!c).join(" ");

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

export const updateState = (setter, data) => {
  setter((old) => ({ ...old, ...data }));
};

export const camelise = (str: string) => {
  const words = str.toLowerCase().split(" ");
  let ret = words[0];
  for (let i = 1; i < words.length; i++) {
    ret += words[i][0].toUpperCase() + words[i].substring(1);
  }
  return ret;
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

// In part, from https://stackoverflow.com/a/17415677
export const formatDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const tzo = -date.getTimezoneOffset();

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
    (tzo < 0 ? "-" : "+") +
    pad(tzo / 60) +
    ":" +
    pad(Math.abs(tzo) % 60)
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
