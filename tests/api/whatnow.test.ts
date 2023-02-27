import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import redis from "../../lib/redis";
import handleWhatNow from "../../pages/api/whatnow";
import { mockUserOnce, users } from "./helpers";

const mockWhatNowData = {
  data: [
    {
      id: "255",
      countryCode: "GBR",
      eventType: "event type",
      regionName: "region name",
      region: null,
      attribution: {
        name: "Name",
        countryCode: "GBR",
        url: "https://www.redcross.org.uk/",
        imageUrl: null,
        translations: {
          en: {
            languageCode: "en",
            name: "attribution name",
            attributionMessage: "attribution",
            published: true,
          },
        },
      },
      translations: {
        en: {
          id: "5049",
          lang: "en",
          webUrl: null,
          title: "title",
          description: "description",
          published: true,
          createdAt: "2019-01-15T14:36:39+00:00",
          stages: {
            mitigation: ["mitigation"],
            seasonalForecast: ["seasonalForecast"],
            watch: ["watch"],
            warning: ["warning"],
            immediate: ["immediate"],
            recover: ["recover"],
          },
        },
      },
    },
  ],
};

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("/api/whatnow", () => {
  test("country code must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    mockUserOnce(null);
    await handleWhatNow(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("non-logged in users cannot fetch WhatNow messages", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { countryCode: "GB" },
    });
    await handleWhatNow(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("logged in users must supply country code", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    mockUserOnce(users.admin);
    await handleWhatNow(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("fetches and caches data from WhatNow API", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { countryCode: "GBR" },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockWhatNowData) })
    );
    mockUserOnce(users.validator);
    await handleWhatNow(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).data?.[0]?.id).toEqual("255");

    // Make sure WhatNow data was cached
    const { res: res2 } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { countryCode: "GBR" },
    });
    global.fetch = jest.fn(() => null);
    jest
      .spyOn(redis, "GET")
      .mockReturnValueOnce(JSON.stringify(mockWhatNowData.data));

    mockUserOnce(users.admin);
    await handleWhatNow(req, res2);
    expect(res2._getStatusCode()).toEqual(200);
    expect(JSON.parse(res2._getData()).data?.[0]?.id).toEqual("255");
  });
});
