import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { authOptions } from "./auth/[...nextauth]";

async function handleGetWhatNowMessages(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.countryCode) {
    throw new ApiError(400, 'You did not supply a country code');
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    throw new ApiError(403, 'You are not logged in');
  }

  // const data = await fetch(`https://api.preparecenter.org/v1/org/${req.query.countryCode}/whatnow`, {
  //   headers: { 'x-api-key': process.env.WHAT_NOW_API_KEY }
  // }).then(res => res.json());

  // return res.json({ data: data.data });

  return res.json({
    data: [
      {
        "id": "255",
        "countryCode": "GBR",
        "eventType": "Extreme Cold",
        "regionName": "National",
        "region": null,
        "attribution": {
          "name": "British Red Cross",
          "countryCode": "GBR",
          "url": "https://www.redcross.org.uk/",
          "imageUrl": null,
          "translations": {
            "en": {
              "languageCode": "en",
              "name": "British Red Cross",
              "attributionMessage": "Key Messages from British Red Cross",
              "published": true
            }
          }
        },
        "translations": {
          "en": {
            "id": "5049",
            "lang": "en",
            "webUrl": null,
            "title": "Key Messages for Extreme Cold",
            "description": "Severe weather can strike quickly and cause major disruption to homes, families and communities. But with a few simple steps, it’s easy to prepare for the worst. These are actions to take to reduce risk and protect you and your household from extreme cold.",
            "published": true,
            "createdAt": "2019-01-15T14:36:39+00:00",
            "stages": {
              "mitigation": [
                "Know your area's risks for extreme weather conditions",
                "Prepare your vehicle with necessary emergency items and fuel",
                "Before winter sets in, make sure your home heating system is working efficiently, consider buying portable gas or oil-fired heaters for emergencies",
                "Plan alternative ways to keep warm if your home heating is disrupted (such as extra blankets and hot water bottles)",
                "If you’re going away during a cold spell, set the heating to come on occasionally"
              ],
              "seasonalForecast": [
                "Prepare your home. Check on pipes and have safe heating sources",
                "Check on neighbors, friends, and those at risk",
                "Before winter sets in, make sure your home heating system is working efficiently Consider buying portable gas or oil-fired heaters for emergencies",
                "Plan alternative ways to keep warm if your home heating is disrupted (Such as extra blankets and hot water bottles)"
              ],
              "watch": [
                "Check regularly on elderly friends, neighbours and relatives",
                "Listen to local news channels for useful information and updates",
                "Keep pets inside during winter weather, move other animals or livestock to sheltered areas, and make sure they have access to food and water"
              ],
              "warning": [
                "Protect yourself with warm clothing and cover exposed skin",
                "Be aware and cautious of icy conditions, especially while driving",
                "Check regularly on elderly friends, neighbours and relatives"
              ],
              "immediate": [
                "Listen to local news channels for useful information and updates",
                "Check regularly on elderly friends, neighbours and relatives, see if they need help staying warm, getting provisions or clearing their pathway of snow",
                "Protect yourself and family by staying warm, e.g. wear a hat, eat and drink regularly, keep pets inside, move other animals to sheltered areas",
                "Only travel when necessary. If travelling, pack food, drinks, clothing and blankets. If you break down or become stranded while driving, don't leave your car and refrain from running the engine for more than a few minutes at a time",
                "Keep the thermostat at a steady temperature. Open cabinet doors to allow warmer air to circulate around the plumbing. Keep garage doors closed if water supply lines are held there. Ensure fuel-burning equipment is vented to outside."
              ],
              "recover": [
                "Be aware and cautious of icy conditions, especially while driving",
                "Be aware of power outages",
                "Be aware of flooding caused by snow melting"
              ]
            }
          }
        }
      },
      {
        "id": "248",
        "countryCode": "GBR",
        "eventType": "Flood",
        "regionName": "National",
        "region": null,
        "attribution": {
          "name": "British Red Cross",
          "countryCode": "GBR",
          "url": "https://www.redcross.org.uk/",
          "imageUrl": null,
          "translations": {
            "en": {
              "languageCode": "en",
              "name": "British Red Cross",
              "attributionMessage": "Key Messages from British Red Cross",
              "published": true
            }
          }
        },
        "translations": {
          "en": {
            "id": "5050",
            "lang": "en",
            "webUrl": null,
            "title": "Key Messages for Flood",
            "description": "Flooding and flash floods can occur almost anywhere, and their impact is often devastating. Five million people live in flood risk areas in England and Wales, so make sure you’re prepared. These are actions to take to reduce risk and protect you and your household from floods.",
            "published": true,
            "createdAt": "2019-01-15T14:47:59+00:00",
            "stages": {
              "mitigation": [
                "Make a household emergency plan, including evacuation routes and destinations. Prepare an emergency kit, with important documents in a sealed bag. Call Floodline to find out if your home is at risk, 0345 988 1188 (England, Scotland, Wales).",
                "If at risk, choose furnishings that are easy to remove or store at a higher level",
                "Stock unfilled sandbags and sand. Consider which types of barriers might best prevent floodwater coming into your home, including airbricks, doors and windows.",
                "Label all mains supplies – gas, water and electricity. Include instructions on how to turn each tap off: it may be dark when you need to do so",
                "Find out if there is a local flood plan, community flood warden or flood emergency evacuation centre"
              ],
              "seasonalForecast": [
                "Prepare an emergency kit, placing important personal documents in a sealed bag",
                "Find out if there is a local flood plan, community flood warden or flood emergency evacuation centre",
                "Buy unfilled sandbags and sand from builders’ merchants"
              ],
              "watch": [
                "Tune in to the local radio/TV for updates",
                "Alert your neighbours, particularly elderly people"
              ],
              "warning": [
                "Tune in to the local radio/TV for updates",
                "Alert your neighbours, particularly elderly people",
                "Move sentimental and irreplaceable items upstairs, or at a higher level, where they should be safe. Move any vehicles to higher levels",
                "Turn off the mains power and water. Put the necessary flood barriers in place.",
                "If you have time, take photographs before you leave, this may help with later insurance claims"
              ],
              "immediate": [
                "Don't walk, swim or drive through floodwater. Don't walk on sea defences or riverbanks.",
                "Avoid contact with floodwater as it may be contaminated with sewage. Don't allow children to play in or near floodwater. Keep your pets indoors and away from flood waters.",
                "Turn off gas, electricity and water. Use a wind-up or battery-operated radio to listen to the local news updates.",
                "If it’s not safe to go outside, stay indoors unless the emergency services ask you to leave. Don't be tempted to go and see where flooding is occurring, especially near rivers.",
                "If you need to evacuate, shut windows, lock doors, take pets and remember your grab bag. The local council will find somewhere for you to stay on a temporary basis. But if you cannot return home soon, the council will provide suitable accommodation."
              ],
              "recover": [
                "Only return home once officials have declared the area safe",
                "Check your home and around for damage and loose power/gas lines. Inform relevant authorities if you find anything. If power lines are down outside your home, do not step in puddles or standing water. Don't use gas or electrical appliances until they have been checked for safety. Boil tap water until supplies have been declared safe.",
                "Do not touch hazardous materials, many materials – such as cleaning products, paint, batteries, contaminated fuel and damaged fuel containers – will now be hazardous. Ask local authorities to help with disposal. If you smell natural or propane gas, or hear a hissing noise, leave immediately and call the fire and rescue service.",
                "Flooding can be very stressful. If you need some help, call NHS 111 to access local crisis support services"
              ]
            }
          }
        }
      },
      {
        "id": "264",
        "countryCode": "GBR",
        "eventType": "Pandemic",
        "regionName": "National",
        "region": null,
        "attribution": {
          "name": "British Red Cross",
          "countryCode": "GBR",
          "url": "https://www.redcross.org.uk/",
          "imageUrl": null,
          "translations": {
            "en": {
              "languageCode": "en",
              "name": "British Red Cross",
              "attributionMessage": "Key Messages from British Red Cross",
              "published": true
            }
          }
        },
        "translations": {
          "en": {
            "id": "5003",
            "lang": "en",
            "webUrl": null,
            "title": "Key Messages for Pandemic",
            "description": "Influenza causes many deaths annually, and can hit millions of people in pandemic years. Be prepared for a flu pandemic with our helpful information on how to prevent spreading illness.These are actions to take to reduce risk and protect you and your household from pandemic.",
            "published": true,
            "createdAt": "2018-12-20T17:59:19+00:00",
            "stages": {
              "mitigation": [
                "Wash your hands often with soap and hot water, or a sanitiser gel.",
                "Regularly clean hard surfaces – such as door handles, computer mice and remote controls.",
                "Always practice good health habits to maintain your body’s resistance to infection - eat a balanced diet, drink plenty of fluids, exercise daily, manage stress, get enough rest and sleep"
              ],
              "seasonalForecast": [
                "Use clean tissues to cover your mouth and nose when you cough and sneeze.",
                "Bin the tissues after one use.",
                "Wash your hands often with soap and hot water, or a sanitiser gel.",
                "Regularly clean hard surfaces – such as door handles, computer mice and remote controls."
              ],
              "watch": [
                "Listen to advice of authorities regarding preventative and protective measures"
              ],
              "warning": [
                "Listen to advice of authorities regarding preventative and protective measures"
              ],
              "immediate": [
                "Stay at home.",
                "A special hotline may have been set up to deal with the pandemic (information should be available from NHS 111) - this should be your first port of call.",
                "If in doubt, call your GP."
              ],
              "recover": []
            }
          }
        }
      }
    ]
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetWhatNowMessages(req, res);
  }

  return res.status(405).send('Method not allowed');
}

export default withErrorHandler(handler);
