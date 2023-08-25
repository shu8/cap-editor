import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type Resource = {
  resourceDesc: string;
  uri: string;
  mimeType: string;
};

export type UserAlertingAuthorities = {
  [k: string]: AlertingAuthority & {
    polygon: string | null;
  };
};

export type AlertingAuthority = {
  id: string;
  name: string;
  countryCode: string | null;
  defaultTimezone: string;
  roles: Role[];
  severityCertaintyMatrixEnabled: boolean;
};

export type LocalStorageState = {
  getAlertingAuthorityId: () => string | null;
  setAlertingAuthorityId: (id: string) => void;
  removeAlertingAuthorityId: () => void;
};

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
  };
  createdAt: string;
  updatedAt: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      alertingAuthorities: UserAlertingAuthorities;
    } & DefaultSession["user"];
  }
}
