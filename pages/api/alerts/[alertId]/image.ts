import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sharp from "sharp";
import StaticMaps from "staticmaps";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import prisma from "../../../../lib/prisma";
import { CAPV12JSONSchema } from "../../../../lib/types/cap.schema";

const clip = (str: string, length: number) => {
  if (str.length <= length) return str;
  return str.substring(0, length - 2) + "...";
};

async function handleRenderImage(
  req: NextApiRequest,
  res: NextApiResponse,
  alertId: string
) {
  const alert = await prisma.alert.findFirst({ where: { id: alertId } });
  if (!alert) throw new ApiError(404, "You did not provide a valid alert ID");

  const map = new StaticMaps({ width: 300, height: 300 });
  const imageMessageOffset = 50;
  const data = alert.data as CAPV12JSONSchema;

  const areas = data.info?.[0].area ?? [];
  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    if (area.circle) {
      area.circle.forEach((circle) => {
        const [center, radius] = circle.split(" ");
        map.addCircle({
          coord: center
            .split(",")
            .map((x: string) => +x)
            .reverse() as [number, number],
          radius: +radius,
        });
      });
    }
    if (area.polygon) {
      if (Array.isArray(area.polygon[0][0])) {
        map.addMultiPolygon({
          coords: area.polygon.map((r) =>
            r.map((a) => (Array.isArray(a) ? a.reverse() : a)).reverse()
          ),
          color: "#FF0000FF",
          width: 1,
        });
      } else {
        map.addPolygon({
          coords: area.polygon.map((r) => r.reverse()),
          color: "#FF0000FF",
          width: 1,
        });
      }
    }
  }

  await map.render();
  const buffer = await sharp(await map.image.buffer())
    .extend({
      top: imageMessageOffset,
      background: { r: 255, g: 255, b: 255 },
    })
    .composite([
      {
        input: {
          text: {
            text: `<span foreground='black' font_weight='bold' allow_breaks='true'>${clip(
              data.info![0].headline ?? "Alert",
              26
            )}: ${data.info![0].urgency}\n${clip(
              data.info![0].responseType!.join(", "),
              36
            )}\n${new Date(data.info![0].onset!).toDateString()} - ${new Date(
              data.info![0].expires!
            ).toDateString()}</span>`,
            font: "Times New Roman",
            height: 10,
            rgba: true,
          },
        },
        left: 5,
        top: 5,
      },
    ])
    .webp()
    .toBuffer();

  res.setHeader("Content-Type", "image/webp");
  res.send(buffer);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertId } = req.query;

  if (typeof alertId !== "string") {
    throw new ApiError(400, "You did not provide a valid Alert ID");
  }

  if (req.method === "GET") {
    return handleRenderImage(req, res, alertId);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
