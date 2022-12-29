import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";


export type WhatNowResponse = {
  id: string;
  countryCode: string;
  eventType: string;
  webUrl: string;
  regionName: string;
  attribution: {
    url: string;
    imageUrl: string;
    translations: {
      [key: string]: {
        name: string;
        attributionMessage: string;
      };
    };
  };
  translations: {
    [key: string]: {
      lang: string;
      title: string;
      description: string;
      stages: {
        mitigation: string[];
        seasonalForecast: string[];
        warning: string[];
        watch: string[];
        immediate: string[];
        recover: string[];
      };
    };
  },
  createdAt: string;
  updatedAt: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      roles: Role[];
      email: string;
    } & DefaultSession['user'];
  }
}
