import { XMLParser } from "fast-xml-parser";

export const fetchWMOAlertingAuthorities = async () => {
  // const result = await fetch(
  //   "https://alertingauthority.wmo.int/rss.xml"
  // ).then((res) => res.text());

  // const parser = new XMLParser();
  // const alertingAuthorities = parser.parse(result);

  // const data = alertingAuthorities.rss.channel.item.map((i: any) => ({
  //   name: i.title,
  //   id: i.guid,
  //   author: i.author,
  //   countryCode: i["iso:countrycode"],
  //   polygon: i["cap:area"]?.["cap:polygon"]
  // }));

  const data = [
    {
      "name": "Croatia: Croatian Meteorological and Hydrological Service",
      "id": "urn:oid:2.49.0.0.191.0",
      "author": "tanja.renko@cirus.dhz.hr",
      "countryCode": "HRV",
      "polygon": "46.7,13.4 42.2,13.4 42.2,19.9 46.7,19.9 46.7,13.4"
    },
    {
      "name": "Timor-Leste: National Directorate of Meteorology and Geophysics",
      "id": "urn:oid:2.49.0.0.626.0",
      "author": "meteoffice05.tl@gmail.com",
      "countryCode": "TLS"
    },
    {
      "name": "Uruguay: Instituto Uruguayo de Meteorología",
      "id": "urn:oid:2.49.0.0.858.0",
      "author": "p.rivero@inumet.gub.uy",
      "countryCode": "URY",
      "polygon": "-30.0,-58.5 -35.3,-58.5 -35.3,-52.8 -30.0,-52.8 -30.0,-58.5"
    },
    {
      "name": "Serbia: Republic Hydrometeorological Service of Serbia",
      "id": "urn:oid:2.49.0.0.688.0",
      "author": "goran.mihajlovic@hidmet.gov.rs",
      "countryCode": "SRB",
      "polygon": "46.4,18.8 41.7,18.8 41.7,23.4 46.4,23.4 46.4,18.8"
    },
    {
      "name": "Zambia: Zambia Meteorological Department",
      "id": "urn:oid:2.49.0.0.894.0",
      "author": "peggytholezulu@gmail.com",
      "countryCode": "ZMB",
      "polygon": "-8,22 -19,22 -19,34 -8,34 -8,22"
    },
    {
      "name": "Timor-Leste: Dirrecão Nacional Meteorologia e Geofisica",
      "id": "urn:oid:2.49.0.0.626.0",
      "author": "meteoffice05.tl@gmail.com",
      "countryCode": "TLS"
    },
    {
      "name": "Norway: Norwegian Water Resources and Energy Directorate",
      "id": "urn:oid:2.49.0.0.578.1",
      "author": "hec@nve.no",
      "countryCode": "NOR",
      "polygon": "81,4 57,4 57,32 81,32 81,4"
    },
    {
      "name": "Nigeria: Nigerian Meteorological Agency",
      "id": "urn:oid:2.49.0.0.566.0",
      "author": "w.ibrahim@nimet.gov.ng",
      "countryCode": "NGA"
    },
    {
      "name": "Italy: National Centre for Aerospace Meteorology and Climatology",
      "id": "urn:oid:2.49.0.0.380.3",
      "author": "andrea.sabbatini@aeronautica.difesa.it",
      "countryCode": "ITA",
      "polygon": "48,6 36,6 36,19 48,19 48,6"
    },
    {
      "name": "Iraq: Iraqi Meteorological Organization and Seismology",
      "id": "urn:oid:2.49.0.0.368.0",
      "author": "emad.k.almaliki@gmail.com",
      "countryCode": "IRQ"
    },
    {
      "name": "Ghana: Ghana Meteorological Services Department",
      "id": "urn:oid:2.49.0.0.288.0",
      "author": "felicityahafianyo@gmail.com",
      "countryCode": "GHA"
    },
    {
      "name": "Denmark: Danish Meteorological Institute",
      "id": "urn:oid:2.49.0.0.208.0",
      "author": "kjs@dmi.dk",
      "countryCode": "DNK",
      "polygon": "83.8,-74.0 54.5,-74.0 54.5,15.5 83.8,15.5 83.8,-74.0"
    },
    {
      "name": "Djibouti: Service de la Météorologie",
      "id": "urn:oid:2.49.0.0.262.0",
      "author": "omarallaleh@gmail.com",
      "countryCode": "DJI"
    },
    {
      "name": "Sao Tome and Principe: Institut National de Météorologie",
      "id": "urn:oid:2.49.0.0.678.0",
      "author": "niltonpereira81@hotmail.com",
      "countryCode": "STP",
      "polygon": "0.7,6.0 -0.3,6.0 -0.3,7.1 0.7,7.1 0.7,6.0"
    },
    {
      "name": "Mauritania: Office National de la Météorologie",
      "id": "urn:oid:2.49.0.0.478.0",
      "author": "sidiloudey2@yahoo.fr",
      "countryCode": "MRT",
      "polygon": "28,-17 14,-17 14,-4 28,-4 28,-17"
    },
    {
      "name": "Albania: Hydrometeorological Institute",
      "id": "urn:oid:2.49.0.0.8.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ALB"
    },
    {
      "name": "Andorra: Servei Meteorològic d'Andorra",
      "id": "urn:oid:2.49.0.0.20.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "AND",
      "polygon": "42.65,1.40 42.43,1.40 42.43,1.80 42.65,1.80 42.65,1.40"
    },
    {
      "name": "Armenia: Armenian State Hydrometeorological and Monitoring Service",
      "id": "urn:oid:2.49.0.0.51.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ARM"
    },
    {
      "name": "Australia: Bureau of Meteorology",
      "id": "urn:oid:2.49.0.0.36.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUS"
    },
    {
      "name": "Australia: Hydrological Services Program",
      "id": "urn:oid:2.49.0.0.36.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUS"
    },
    {
      "name": "Austria: Abteilung Wasserhaushalt",
      "id": "urn:oid:2.49.0.0.40.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUT",
      "polygon": "49.28,9.49 46.41,9.49 46.41,17.27 49.28,17.27 49.28,9.49"
    },
    {
      "name": "Austria: Amt der Vorarlberger Landesregierung. Wasserwirtschaft",
      "id": "urn:oid:2.49.0.0.40.5",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUT",
      "polygon": "47.63,9.36 46.74,9.36 46.74,10.26 47.63,10.26 47.63,9.36"
    },
    {
      "name": "Austria: Hydrographischer Dienst Tirol",
      "id": "urn:oid:2.49.0.0.40.6",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUT",
      "polygon": "47.78,10.06 46.62,10.06 46.62,12.88 47.78,12.88 47.78,10.06"
    },
    {
      "name": "Bahamas: Department of Meteorology",
      "id": "urn:oid:2.49.0.0.44.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BHS"
    },
    {
      "name": "Bangladesh: Bangladesh Water Development Board (BWDB)",
      "id": "urn:oid:2.49.0.0.50.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "BGD"
    },
    {
      "name": "Belarus: Department of Hydrometeorology",
      "id": "urn:oid:2.49.0.0.112.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BLR"
    },
    {
      "name": "Belgium: Institut Royal Météorologique",
      "id": "urn:oid:2.49.0.0.56.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BEL"
    },
    {
      "name": "Bhutan: Council for Renewable Natural Resources Research",
      "id": "urn:oid:2.49.0.0.64.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BTN"
    },
    {
      "name": "Bolivia (Plurinational State of): Servicio Nacional de Meteorología e Hidrología",
      "id": "urn:oid:2.49.0.0.68.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BOL"
    },
    {
      "name": "British Caribbean Territories : Caribbean Meteorological Organization",
      "id": "urn:oid:2.49.0.0.826.2",
      "author": "wmoraa@wmo.int",
      "countryCode": "GBR",
      "polygon": "22.1,-81.7 16.6,-81.7 16.6,-62.1 22.1,-62.1 22.1,-81.7"
    },
    {
      "name": "British Virgin Islands: Department of Disaster Management",
      "id": "urn:oid:2.49.0.0.92.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "VGB"
    },
    {
      "name": "Bulgaria: National Institute of Meteorology and Hydrology",
      "id": "urn:oid:2.49.0.0.100.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "BGR"
    },
    {
      "name": "Cabo Verde: Instituto Nacional de Meteorologia e Geophísica",
      "id": "urn:oid:2.49.0.0.132.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "CPV"
    },
    {
      "name": "Cambodia: Department of Meteorology (DOM)",
      "id": "urn:oid:2.49.0.0.116.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "KHM"
    },
    {
      "name": "Cambodia: Ministry of Water Resources and Meteorology",
      "id": "urn:oid:2.49.0.0.116.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "KHM"
    },
    {
      "name": "Canada: Alberta Emergency Management Agency (Government of Alberta, Ministry of Municipal Affairs)",
      "id": "urn:oid:2.49.0.0.124.2",
      "author": "wmoraa@wmo.int",
      "countryCode": "CAN",
      "polygon": "60,-120 49,-120 49,-110 60,-110 60,-120"
    },
    {
      "name": "Canada: Ministère de la Sécurité publique du Québec",
      "id": "urn:oid:2.49.0.0.124.3",
      "author": "wmoraa@wmo.int",
      "countryCode": "CAN",
      "polygon": "62.5823,-79.7648 44.9999,-79.7648 44.9999,-57.0956 62.5823,-57.0956 62.5823,-79.7648"
    },
    {
      "name": "Chad: Direction des Ressources en Eau et de la Météorologie",
      "id": "urn:oid:2.49.0.0.148.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TCD"
    },
    {
      "name": "Chile: Dirección General de Aguas",
      "id": "urn:oid:2.49.0.0.152.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "CHL"
    },
    {
      "name": "China: Ministry of Water Resources",
      "id": "urn:oid:2.49.0.0.156.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "CHN"
    },
    {
      "name": "Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales",
      "id": "urn:oid:2.49.0.0.170.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "COL"
    },
    {
      "name": "Cook Islands: Cook Islands Meteorological Service",
      "id": "urn:oid:2.49.0.0.184.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "COK"
    },
    {
      "name": "Cuba: Instituto de Meteorología",
      "id": "urn:oid:2.49.0.0.192.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "CUB"
    },
    {
      "name": "Curaçao and Sint Maarten: Meteorological Department Curacao",
      "id": "urn:oid:2.49.0.0.530.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ANT"
    },
    {
      "name": "Cyprus: Meteorological Service",
      "id": "urn:oid:2.49.0.0.196.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "CYP",
      "polygon": "36.9,25 30.8,25 30.8,36 36.9,36 36.9,25"
    },
    {
      "name": "Democratic People's Republic of Korea: State Hydrometeorological Administration",
      "id": "urn:oid:2.49.0.0.408.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "PRK"
    },
    {
      "name": "Dominica: Dominica Meteorological Services",
      "id": "urn:oid:2.49.0.0.212.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "DMA"
    },
    {
      "name": "Dominican Republic: Oficina Nacional de Meteorología",
      "id": "urn:oid:2.49.0.0.214.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "DOM"
    },
    {
      "name": "Eritrea: Civil Aviation Authority",
      "id": "urn:oid:2.49.0.0.232.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ERI"
    },
    {
      "name": "Estonia: Estonian Meteorological and Hydrological Institute",
      "id": "urn:oid:2.49.0.0.233.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "EST"
    },
    {
      "name": "Ethiopia: National Meteorological Agency",
      "id": "urn:oid:2.49.0.0.231.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ETH"
    },
    {
      "name": "Fiji: Suva Water Supplies",
      "id": "urn:oid:2.49.0.0.242.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "FJI"
    },
    {
      "name": "Finland: Finnish Environment Institute",
      "id": "urn:oid:2.49.0.0.246.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "FIN"
    },
    {
      "name": "France: Service Central d'Hydrométéorologie et d'Appui à la Prévision des Inondations",
      "id": "urn:oid:2.49.0.0.250.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "FRA"
    },
    {
      "name": "Georgia: Department of Hydrometeorology",
      "id": "urn:oid:2.49.0.0.268.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "GEO"
    },
    {
      "name": "Germany: Federal Institute of Hydrology",
      "id": "urn:oid:2.49.0.0.276.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "DEU"
    },
    {
      "name": "Grenada: Caribbean Meteorological Organization",
      "id": "urn:oid:2.49.0.0.308.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "GRD"
    },
    {
      "name": "Guatemala: Instituto Nacional de Sismología, Vulcanología, Meteorología e Hidrología (INSIVUMEH)",
      "id": "urn:oid:2.49.0.0.320.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "GTM"
    },
    {
      "name": "Guinea-Bissau: Direcção-General dos Recursos Hidrico",
      "id": "urn:oid:2.49.0.0.624.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "GNB"
    },
    {
      "name": "Guyana: Civil Defence Commission",
      "id": "urn:oid:2.49.0.0.328.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "GUY"
    },
    {
      "name": "Haiti: Haiti Weather",
      "id": "urn:oid:2.49.0.0.332.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "HTI"
    },
    {
      "name": "Honduras: Servicio Meteorologico Nacional",
      "id": "urn:oid:2.49.0.0.340.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "HND"
    },
    {
      "name": "Hungary: VITUKI",
      "id": "urn:oid:2.49.0.0.348.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "HUN"
    },
    {
      "name": "Israel: Israel Meteorological Service",
      "id": "urn:oid:2.49.0.0.376.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "ISR"
    },
    {
      "name": "Jamaica: Meteorological Service",
      "id": "urn:oid:2.49.0.0.388.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "JAM"
    },
    {
      "name": "Kazakhstan: Kazhydromet",
      "id": "urn:oid:2.49.0.0.398.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "KAZ"
    },
    {
      "name": "Kenya: Ministry of Water and Irrigation",
      "id": "urn:oid:2.49.0.0.404.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "KEN"
    },
    {
      "name": "Kiribati: Kiribati Meteorological Service",
      "id": "urn:oid:2.49.0.0.296.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "KIR"
    },
    {
      "name": "Kyrgyzstan: Main Hydrometeorological Administration",
      "id": "urn:oid:2.49.0.0.417.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "KGZ"
    },
    {
      "name": "Lao People's Democratic Republic: Department of Meteorology and Hydrology",
      "id": "urn:oid:2.49.0.0.418.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "LAO"
    },
    {
      "name": "Lebanon: Service Météorologique",
      "id": "urn:oid:2.49.0.0.422.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "LBN"
    },
    {
      "name": "Liberia: Ministry of Transport",
      "id": "urn:oid:2.49.0.0.430.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "LBR"
    },
    {
      "name": "Libya (State of): General Water Authority",
      "id": "urn:oid:2.49.0.0.434.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "LBY"
    },
    {
      "name": "Luxembourg: Administration de l'Aéroport de Luxembourg",
      "id": "urn:oid:2.49.0.0.442.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "LUX"
    },
    {
      "name": "Luxembourg: Administration de la Gestion de l'Eau",
      "id": "urn:oid:2.49.0.0.442.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "LUX"
    },
    {
      "name": "Macao, China: Meteorological and Geophysical Bureau",
      "id": "urn:oid:2.49.0.0.446.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MAC"
    },
    {
      "name": "Madagascar: Direction Générale de la Météorologie",
      "id": "urn:oid:2.49.0.0.450.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MDG",
      "polygon": "-12,42.8 -26,42.8 -26,51.4 -12,51.4 -12,42.8"
    },
    {
      "name": "Malawi: Ministry of Water Department",
      "id": "urn:oid:2.49.0.0.454.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "MWI"
    },
    {
      "name": "Malaysia: Department of Irrigation and Drainage",
      "id": "urn:oid:2.49.0.0.458.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "MYS"
    },
    {
      "name": "Mali: Direction Nationale de l'Hydraulique",
      "id": "urn:oid:2.49.0.0.466.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "MLI"
    },
    {
      "name": "Micronesia (Federated States of): FSM Weather Station",
      "id": "urn:oid:2.49.0.0.583.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "FSM"
    },
    {
      "name": "Monaco: Mission Permanente de la Principauté de Monaco",
      "id": "urn:oid:2.49.0.0.492.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MCO"
    },
    {
      "name": "Mongolia: National Agency For Meteorology, Hydrology and Environment Monitoring",
      "id": "urn:oid:2.49.0.0.496.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MNG"
    },
    {
      "name": "Montserrat: Disaster Management Coordination Agency",
      "id": "urn:oid:2.49.0.0.500.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MSR"
    },
    {
      "name": "Morocco: Direction de la Météorologie Natinale",
      "id": "urn:oid:2.49.0.0.504.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MAR"
    },
    {
      "name": "Mozambique: Direcccion Nacional de Aqua",
      "id": "urn:oid:2.49.0.0.508.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "MOZ"
    },
    {
      "name": "Namibia: Namibia Meteorological Service",
      "id": "urn:oid:2.49.0.0.516.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "NAM"
    },
    {
      "name": "Nepal: Department of Hydrology and Meteorology",
      "id": "urn:oid:2.49.0.0.524.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "NPL"
    },
    {
      "name": "Nicaragua: Dirección General de Meteorología",
      "id": "urn:oid:2.49.0.0.558.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "NIC"
    },
    {
      "name": "Niger: Ministère des Ressources en Eau",
      "id": "urn:oid:2.49.0.0.562.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "NER"
    },
    {
      "name": "Niue: Niue Meteorological Service",
      "id": "urn:oid:2.49.0.0.570.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "NIU",
      "polygon": "-18.8,-170.1 -19.3,-170.1 -19.3,-169.6 -18.8,-169.6 -18.8,-170.1"
    },
    {
      "name": "North Macedonia: Republic Hydrometeorological Organization",
      "id": "urn:oid:2.49.0.0.807.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "MKD"
    },
    {
      "name": "Panama: Hidrometeorología",
      "id": "urn:oid:2.49.0.0.591.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "PAN"
    },
    {
      "name": "Papua New Guinea: Papua New Guinea Meteorological Service",
      "id": "urn:oid:2.49.0.0.598.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "PNG"
    },
    {
      "name": "Peru: Servicio Nacional de Meteorologia e Hidrologia",
      "id": "urn:oid:2.49.0.0.604.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "PER"
    },
    {
      "name": "Qatar: Civil Aviation Authority",
      "id": "urn:oid:2.49.0.0.634.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "QAT"
    },
    {
      "name": "Republic of Korea: Korea Meteorological Administration",
      "id": "urn:oid:2.49.0.0.410.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "KOR"
    },
    {
      "name": "Romania: National Institute of Hydrology and Water Management",
      "id": "urn:oid:2.49.0.0.642.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "ROM"
    },
    {
      "name": "Rwanda: Rwanda Meteorological Service",
      "id": "urn:oid:2.49.0.0.646.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "RWA"
    },
    {
      "name": "Saint Vincent and the Grenadines: Caribbean Meteorological Organization",
      "id": "urn:oid:2.49.0.0.670.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "VCT"
    },
    {
      "name": "Samoa: Samoa Meteorology Division",
      "id": "urn:oid:2.49.0.0.882.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "WSM"
    },
    {
      "name": "Saudi Arabia: Presidency of Meteorology and Environment",
      "id": "urn:oid:2.49.0.0.682.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SAU"
    },
    {
      "name": "Senegal: Direction de l'Hydraulique Rurale et du Réseau Hydrographique National",
      "id": "urn:oid:2.49.0.0.686.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "SEN"
    },
    {
      "name": "Sierra Leone: Meteorological Department",
      "id": "urn:oid:2.49.0.0.694.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SLE"
    },
    {
      "name": "Singapore: National Environment Agency",
      "id": "urn:oid:2.49.0.0.702.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "SGP"
    },
    {
      "name": "Somalia: Permanent Mission of Somalia",
      "id": "urn:oid:2.49.0.0.706.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SOM"
    },
    {
      "name": "South Africa: Department of Water Affairs and Forestry",
      "id": "urn:oid:2.49.0.0.710.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "ZAF"
    },
    {
      "name": "South Sudan: South Sudan Weather Service",
      "id": "urn:oid:2.49.0.0.728.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SSD",
      "polygon": "12.42,23.77 3.33,23.77 3.33,35.88 12.42,35.88 12.42,23.77"
    },
    {
      "name": "Sri Lanka: Department of Meteorology",
      "id": "urn:oid:2.49.0.0.144.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "LKA"
    },
    {
      "name": "Sri Lanka: Hydrology Division, Department of Irrigation",
      "id": "urn:oid:2.49.0.0.144.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "LKA"
    },
    {
      "name": "Sudan: Nile Waters Department",
      "id": "urn:oid:2.49.0.0.729.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "SDN"
    },
    {
      "name": "Suriname: Meteorological Service",
      "id": "urn:oid:2.49.0.0.740.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SUR",
      "polygon": "6.2,-58.1 1.8,-58.1 1.8,-53.9 6.2,-53.9 6.2,-58.1"
    },
    {
      "name": "Sweden: Swedish Meteorological and Hydrological Institute",
      "id": "urn:oid:2.49.0.0.752.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SWE"
    },
    {
      "name": "Syrian Arab Republic: Ministry of Defence Meteorological Department",
      "id": "urn:oid:2.49.0.0.760.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "SYR"
    },
    {
      "name": "Tajikistan: Main Administration of Hydrometeorology and Monitoring of the Environment",
      "id": "urn:oid:2.49.0.0.762.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TJK"
    },
    {
      "name": "Togo: Direction de la Météorologie Nationale",
      "id": "urn:oid:2.49.0.0.768.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TGO"
    },
    {
      "name": "Tonga: Tonga Meteorological Service",
      "id": "urn:oid:2.49.0.0.776.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TON"
    },
    {
      "name": "Tunisia: Direction Nationale de la Gestion des Ressources en Eau",
      "id": "urn:oid:2.49.0.0.788.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "TUN"
    },
    {
      "name": "Türkiye: Turkish State Meteorological Service",
      "id": "urn:oid:2.49.0.0.792.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TUR",
      "polygon": "42.7,25.9 35.7,25.9 35.7,45.1 42.7,45.1 42.7,25.9"
    },
    {
      "name": "Turkmenistan: Administration of Hydrometeorology",
      "id": "urn:oid:2.49.0.0.795.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TKM"
    },
    {
      "name": "Turks and Caicos Islands: Department of Disaster Management and Emergencies",
      "id": "urn:oid:2.49.0.0.796.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TCA"
    },
    {
      "name": "Tuvalu: Tuvalu Met Service",
      "id": "urn:oid:2.49.0.0.798.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "TUV",
      "polygon": "-10.5,179.2 -10.9,179.2 -10.9,179.7 -10.5,179.7 -10.5,179.2"
    },
    {
      "name": "Uganda: Directorate for Water Development",
      "id": "urn:oid:2.49.0.0.800.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "UGA"
    },
    {
      "name": "United Kingdom of Great Britain and Northern Ireland: Centre for Ecology and Hydrology",
      "id": "urn:oid:2.49.0.0.826.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "GBR"
    },
    {
      "name": "United States of America: Environmental Protection Agency, Air Quality Alerts",
      "id": "urn:oid:2.49.0.0.840.3",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "73,-176 11,-176 11,-61 73,-61 73,-176"
    },
    {
      "name": "United States of America: Federal Emergency Management Agency, Integrated Public Alert and Warning System",
      "id": "urn:oid:2.49.0.0.840.4",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "73,-176 11,-176 11,-61 73,-61 73,-176"
    },
    {
      "name": "United States of America: National Oceanic and Atmospheric Administration (NOAA), National Tsunami Warning Center",
      "id": "urn:oid:2.49.0.0.840.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "73,-176 11,-176 11,-61 73,-61 73,-176"
    },
    {
      "name": "United States of America: National Oceanic and Atmospheric Administration (NOAA), National Weather Service",
      "id": "urn:oid:2.49.0.0.840.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "73,-176 11,-176 11,-61 73,-61 73,-176"
    },
    {
      "name": "United States of America: United States Geological Survey, Earthquakes",
      "id": "urn:oid:2.49.0.0.840.2",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "90,-180 -90,-180 -90,180 90,180 90,-180"
    },
    {
      "name": "United States of America: United States Geological Survey, Volcano Hazards Program",
      "id": "urn:oid:2.49.0.0.840.5",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA",
      "polygon": "73,-176 11,-176 11,-61 73,-61 73,-176"
    },
    {
      "name": "Uzbekistan: Uzhydromet",
      "id": "urn:oid:2.49.0.0.860.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "UZB"
    },
    {
      "name": "Venezuela, Bolivarian Republic of: Dirección de Meteorología e Hidrología - Ministerio del Ambiente",
      "id": "urn:oid:2.49.0.0.862.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "VEN"
    },
    {
      "name": "Venezuela, Bolivarian Republic of: Servicio de Meteorologia de la Aviacion",
      "id": "urn:oid:2.49.0.0.862.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "VEN"
    },
    {
      "name": "Viet Nam: Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.704.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "VNM"
    },
    {
      "name": "Thailand: Thai Meteorological Department (TMD)",
      "id": "urn:oid:2.49.0.0.764.0",
      "author": "webmaster@tmd.go.th",
      "countryCode": "THA",
      "polygon": "21,96.8 5,96.8 5,106.4 21,106.4 21,96.8"
    },
    {
      "name": "Togo: Direction Générale de la météorologie Nationale",
      "id": "urn:oid:2.49.0.0.768.0",
      "author": "ablaagb@yahoo.fr",
      "countryCode": "TGO",
      "polygon": "11.5,-0.5 6.0,-0.5 6.0,2.0 11.5,2.0 11.5,-0.5"
    },
    {
      "name": "Cameroon: Direction de la Météorologie Nationale",
      "id": "urn:oid:2.49.0.0.120.0",
      "author": "hansndonwi@gmail.com",
      "countryCode": "CMR"
    },
    {
      "name": "Benin: Service Météorologique National",
      "id": "urn:oid:2.49.0.0.204.0",
      "author": "dak_pie2005@yahoo.fr",
      "countryCode": "BEN"
    },
    {
      "name": "Solomon Islands: Solomon Islands Meteorological Service",
      "id": "urn:oid:2.49.0.0.90.0",
      "author": "a.rilifia@met.gov.sb",
      "countryCode": "SLB"
    },
    {
      "name": "Egypt: Egyptian Meteorological Authority",
      "id": "urn:oid:2.49.0.0.818.0",
      "author": "mshaheen1974@yahoo.com",
      "countryCode": "EGY",
      "polygon": "21.052,24 32.183,24 32.183,39 21.052,39 21.052,24"
    },
    {
      "name": "Libya (State of): Libyan National Meteorological Centre",
      "id": "urn:oid:2.49.0.0.434.0",
      "author": "abd339793@gmail.com",
      "countryCode": "LBY"
    },
    {
      "name": "Gabon: Cabinet du Ministre des Transports",
      "id": "urn:oid:2.49.0.0.266.0",
      "author": "claudedatia@gmail.com",
      "countryCode": "GAB"
    },
    {
      "name": "Congo: Direction de la Météorologie",
      "id": "urn:oid:2.49.0.0.178.0",
      "author": "itemngassay@gmail.com",
      "countryCode": "COG",
      "polygon": "4.0,10.9 -5.4,10.9 -5.4,19.2 4.0,19.2 4.0,10.9"
    },
    {
      "name": "Thailand: National Disaster Warning Center (NDWC)",
      "id": "urn:oid:2.49.0.0.764.1",
      "author": "webmaster@tmd.go.th",
      "countryCode": "THA",
      "polygon": "21,96.8 5,96.8 5,106.4 21,106.4 21,96.8"
    },
    {
      "name": "Uganda: Department of Meteorology",
      "id": "urn:oid:2.49.0.0.800.0",
      "author": "nakaggaa@gmail.com",
      "countryCode": "UGA"
    },
    {
      "name": "New Zealand: Meteorological Service of New Zealand Limited",
      "id": "urn:oid:2.49.0.0.554.0",
      "author": "chris.noble@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34.000,166.00 -48.000,166.00 -48.000,179.000 -34.000,179.000 -34.000,166.00"
    },
    {
      "name": "Burundi: Institut Géographique du Burundi",
      "id": "urn:oid:2.49.0.0.108.0",
      "author": "ngendadonatien@gmail.com",
      "countryCode": "BDI",
      "polygon": "-2.25,28.9 -4.57,28.9 -4.57,31.01 -2.25,31.01 -2.25,28.9"
    },
    {
      "name": "Eswatini: Eswatini Meteorological Service",
      "id": "urn:oid:2.49.0.0.748.0",
      "author": "ncongwanemusa@gmail.com",
      "countryCode": "SWZ",
      "polygon": "-25.4,30.5 -27.5,30.5 -27.5,32.5 -25.4,32.5 -25.4,30.5"
    },
    {
      "name": "Democratic Republic of the Congo: Agence Nationale de la Météorologie et de Télédétection par Satellite",
      "id": "urn:oid:2.49.0.0.180.0",
      "author": "mpwomwenge@gmail.com",
      "countryCode": "COD",
      "polygon": "6,13 -13,13 -13,32 6,32 6,13"
    },
    {
      "name": "Mozambique: Instituto Nacional de Meteorologia",
      "id": "urn:oid:2.49.0.0.508.0",
      "author": "mussa2503@gmail.com",
      "countryCode": "MOZ",
      "polygon": "-9,30 -27,30 -27,41 -9,41 -9,30"
    },
    {
      "name": "Maldives: National Disaster Management Authority",
      "id": "urn:oid:2.49.0.0.462.1",
      "author": "ali.shareef@met.gov.mv",
      "countryCode": "MDV",
      "polygon": "7.1,72.69 -0.7,72.69 -0.7,73.64 7.1,73.64 7.1,72.69"
    },
    {
      "name": "Maldives: Maldives Meteorological Service",
      "id": "urn:oid:2.49.0.0.462.0",
      "author": "ali.shareef@met.gov.mv",
      "countryCode": "MDV",
      "polygon": "7.1,72.69 -0.7,72.69 -0.7,73.64 7.1,73.64 7.1,72.69"
    },
    {
      "name": "Guinea: Direction Nationale de la Météorologie",
      "id": "urn:oid:2.49.0.0.324.0",
      "author": "ibrahimakalil@gmail.com",
      "countryCode": "GIN"
    },
    {
      "name": "Costa Rica: Instituto Meteorologico Nacional",
      "id": "urn:oid:2.49.0.0.188.0",
      "author": "jnaranjo@imn.ac.cr",
      "countryCode": "CRI",
      "polygon": "11.2,-90 2.5,-90 2.5,-82.5 11.2,-82.5 11.2,-90"
    },
    {
      "name": "Central African Republic: Direction Générale de la Météorologie",
      "id": "urn:oid:2.49.0.0.140.0",
      "author": "aymardlelong@gmail.com",
      "countryCode": "CAF"
    },
    {
      "name": "Senegal: AGENCE NATIONALE DE L'AVIATION CIVILE ET DE LA METEOROLOGIE",
      "id": "urn:oid:2.49.0.0.686.0",
      "author": "awa@anacim.sn",
      "countryCode": "SEN"
    },
    {
      "name": "Comoros: Direction de la Météorologie Nationale",
      "id": "urn:oid:2.49.0.0.174.0",
      "author": "radhinaarcene@gmail.com",
      "countryCode": "COM",
      "polygon": "-11.4,43.2 -12.4,43.2 -12.4,44.5 -11.4,44.5 -11.4,43.2"
    },
    {
      "name": "Guinea-Bissau: Météorologie de Guinée Bissau",
      "id": "urn:oid:2.49.0.0.624.0",
      "author": "cherno_lm@yahoo.fr",
      "countryCode": "GNB"
    },
    {
      "name": "Côte d'Ivoire: Direction de la Météorologie Nationale",
      "id": "urn:oid:2.49.0.0.384.0",
      "author": "camille.ahile@sodexam.ci",
      "countryCode": "CIV"
    },
    {
      "name": "Niger: Direction de la Météorologie Nationale",
      "id": "urn:oid:2.49.0.0.562.0",
      "author": "ousmanebaoua@yahoo.fr",
      "countryCode": "NER"
    },
    {
      "name": "Paraguay: Dirección de Meteorología e Hidrología",
      "id": "urn:oid:2.49.0.0.600.0",
      "author": "raul.rodas@meteorologia.gov.py",
      "countryCode": "PRY",
      "polygon": "-18.9,-62.8 -27.8,-62.8 -27.8,-53.6 -18.9,-53.6 -18.9,-62.8"
    },
    {
      "name": "Burkina Faso: Direction de la Météorologie",
      "id": "urn:oid:2.49.0.0.854.0",
      "author": "guinabf@yahoo.fr",
      "countryCode": "BFA"
    },
    {
      "name": "Gambia (The): Department of Water Resources",
      "id": "urn:oid:2.49.0.0.270.0",
      "author": "tbojang@yahoo.co.uk",
      "countryCode": "GMB"
    },
    {
      "name": "British Virgin Islands: Caribbean Meteorological Organization",
      "id": "urn:oid:2.49.0.0.92.1",
      "author": "GDe_Souza@cmo.org.tt",
      "countryCode": "VGB"
    },
    {
      "name": "Seychelles: Seychelles Meteorological Authority",
      "id": "urn:oid:2.49.0.0.690.0",
      "author": "bijouxchantale668@gmail.com",
      "countryCode": "SYC",
      "polygon": "-4.2,46 -9.8,46 -9.8,56 -4.2,56 -4.2,46"
    },
    {
      "name": "Tunisia: National Institute of Meteorology",
      "id": "urn:oid:2.49.0.0.788.0",
      "author": "bassem.nahhali@meteo.tn",
      "countryCode": "TUN",
      "polygon": "29.803,7.2 37.614,7.2 37.614,11.8 29.803,11.8 29.803,7.2"
    },
    {
      "name": "Botswana: Botswana Meteorological Services",
      "id": "urn:oid:2.49.0.0.72.0",
      "author": "jkeretetse@gov.bw",
      "countryCode": "BWA",
      "polygon": "-22.058,20.5 -18.055,20.5 -18.055,25.1 -22.058,25.1 -22.058,20.5"
    },
    {
      "name": "United Kingdom of Great Britain and Northern Ireland: Bermuda Weather Service",
      "id": "urn:oid:2.49.0.0.826.3",
      "author": "mguishard@airportauthority.bm",
      "countryCode": "GBR",
      "polygon": "33.3,-65.7 31.3,-65.7 31.3,-63.7 33.3,-63.7 33.3,-65.7"
    },
    {
      "name": "Mauritius: Mauritius Meteorological Services",
      "id": "urn:oid:2.49.0.0.480.0",
      "author": "sadrame75@gmail.com",
      "countryCode": "MUS",
      "polygon": "-19.83,57.12 -20.60,57.12 -20.60,57.99 -19.83,57.99 -19.83,57.12"
    },
    {
      "name": "Mali: Direction Nationale de la Météorologie du Mali",
      "id": "urn:oid:2.49.0.0.466.0",
      "author": "koumareismahila@gmail.com",
      "countryCode": "MLI"
    },
    {
      "name": "Kenya: Kenya Meteorological Service",
      "id": "urn:oid:2.49.0.0.404.0",
      "author": "mwangi@meteo.go.ke",
      "countryCode": "KEN",
      "polygon": "6.27,32.65 -5.27,32.65 -5.27,43.20 6.27,43.20 6.27,32.65"
    },
    {
      "name": "Lesotho: Lesotho Meteorological Services",
      "id": "urn:oid:2.49.0.0.426.0",
      "author": "srsmphahama@gmail.com",
      "countryCode": "LSO",
      "polygon": "-30.996,26.6 -28.409,26.6 -28.409,30.1 -30.996,30.1 -30.996,26.6"
    },
    {
      "name": "United Republic of Tanzania: Disaster Management Department-PMO",
      "id": "urn:oid:2.49.0.0.834.1",
      "author": "samwel.mbuya@meteo.go.tz",
      "countryCode": "TZA",
      "polygon": "-1,28 -12,28 -12,42 -1,42 -1,28"
    },
    {
      "name": "Spain: Agencia Estatal de Meteorología",
      "id": "urn:oid:2.49.0.0.724.0",
      "author": "jreyv@aemet.es",
      "countryCode": "ESP",
      "polygon": "26.824,-19 44.340,-19 44.340,5 26.824,5 26.824,-19"
    },
    {
      "name": "United Republic of Tanzania: Tanzania Meteorological Authority",
      "id": "urn:oid:2.49.0.0.834.0",
      "author": "samwel.mbuya@meteo.go.tz",
      "countryCode": "TZA",
      "polygon": "-1,28 -12,28 -12,42 -1,42 -1,28"
    },
    {
      "name": "Malawi: Malawi Meteorological Services",
      "id": "urn:oid:2.49.0.0.454.0",
      "author": "yobukachiwanda@yahoo.com",
      "countryCode": "MWI"
    },
    {
      "name": "Ecuador: Instituto Nacional de Meteorología e Hidrología",
      "id": "urn:oid:2.49.0.0.218.0",
      "author": "vladimk_88@hotmail.com",
      "countryCode": "ECU",
      "polygon": "-5.00,-92.00 1.55,-92.00 1.55,-75.10 -5.00,-75.10 -5.00,-92.00"
    },
    {
      "name": "Hong Kong, China: Hong Kong Observatory",
      "id": "urn:oid:2.49.0.0.344.0",
      "author": "hyyeung@hko.gov.hk",
      "countryCode": "HKG",
      "polygon": "22.57,113.80 22.15,113.80 22.15,114.45 22.57,114.45 22.57,113.80"
    },
    {
      "name": "Argentina: Servicio Meteorologico Nacional",
      "id": "urn:oid:2.49.0.0.32.0",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG",
      "polygon": "-21,-74 -56,-74 -56,-53 -21,-53 -21,-74"
    },
    {
      "name": "Algeria: Office National de la Météorologie",
      "id": "urn:oid:2.49.0.0.12.0",
      "author": "m.sidane@meteo.dz",
      "countryCode": "DZA"
    },
    {
      "name": "Chile: Servicio Hidrográfico y Oceanográfico de la Armada",
      "id": "urn:oid:2.49.0.0.152.3",
      "author": "puribe@dgac.gob.cl",
      "countryCode": "CHL"
    },
    {
      "name": "China: China Meteorological Administration",
      "id": "urn:oid:2.49.0.0.156.0",
      "author": "lichao@cma.gov.cn",
      "countryCode": "CHN",
      "polygon": "56.58,70.83 15.06,70.83 15.06,137.97 56.58,137.97 56.58,70.83"
    },
    {
      "name": "New Zealand: National Emergency Management Agency",
      "id": "urn:oid:2.49.0.0.554.2",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34.000,166.00 -48.000,166.00 -48.000,179.000 -34.000,179.000 -34.000,166.00"
    },
    {
      "name": "Oman: Directorate General of Meteorology",
      "id": "urn:oid:2.49.0.0.512.0",
      "author": "j.almaskari@met.gov.om",
      "countryCode": "OMN",
      "polygon": "26.4,52.0 16.5,52.0 16.5,59.9 26.4,59.9 26.4,52.0"
    },
    {
      "name": "Antigua and Barbuda: Antigua and Barbuda Meteorological Service",
      "id": "urn:oid:2.49.0.0.28.78862",
      "author": "keithleym@yahoo.com",
      "countryCode": "ATG",
      "polygon": "Antigua,and Barbuda,and Barbuda, Antigua, Antigua,and"
    },
    {
      "name": "Afghanistan: Afghan Meteorological Authority",
      "id": "urn:oid:2.49.0.0.4.0",
      "author": "noorimet@gmail.com",
      "countryCode": "AFG"
    },
    {
      "name": "India: India Meteorological Department",
      "id": "urn:oid:2.49.0.0.356.0",
      "author": "mohapatraimd@gmail.com",
      "countryCode": "IND",
      "polygon": "37.10,68.12 8.07,68.12 8.07,97.42 37.10,97.42 37.10,68.12"
    },
    {
      "name": "Norway: Norwegian Meteorological Institute",
      "id": "urn:oid:2.49.0.0.578.0",
      "author": "gjermund.m.haugen@met.no",
      "countryCode": "NOR",
      "polygon": "90,-35 49,-35 49,32 90,32 90,-35"
    },
    {
      "name": "Indonesia: Agency for Meteorology Climatology and Geophysics of Republic Indonesia",
      "id": "urn:oid:2.49.0.0.360.0",
      "author": "agiewandala@gmail.com",
      "countryCode": "IDN",
      "polygon": "8,93 -13,93 -13,143 8,143 8,93"
    },
    {
      "name": "Czechia: Czech Hydrometeorological Institute",
      "id": "urn:oid:2.49.0.0.203.0",
      "author": "pavel.borovicka@chmi.cz",
      "countryCode": "CZE",
      "polygon": "51.4,12.1 48.2,12.1 48.2,19.4 51.4,19.4 51.4,12.1"
    },
    {
      "name": "Barbados: Barbados Meteorological Services",
      "id": "urn:oid:2.49.0.0.52.0",
      "author": "sonia.nurse@barbados.gov.bb",
      "countryCode": "BRB",
      "polygon": "13.47,-60.00 12.90,-60.00 12.90,-59.07 13.47,-59.07 13.47,-60.00"
    },
    {
      "name": "Zimbabwe: Zimbabwe Meteorological Services Department",
      "id": "urn:oid:2.49.0.0.716.0",
      "author": "denniskapaso@gmail.com",
      "countryCode": "ZWE"
    },
    {
      "name": "Guyana: Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.328.0",
      "author": "lyndonalves26@gmail.com",
      "countryCode": "GUY",
      "polygon": "9.15,-61.48 1.15,-61.48 1.15,-56.46 9.15,-56.46 9.15,-61.48"
    },
    {
      "name": "United States of America: Palau Weather Service Office",
      "id": "urn:oid:2.49.0.0.585.0",
      "author": "mark.paese@noaa.gov",
      "countryCode": "USA",
      "polygon": "8.34,131.17 2.87,131.17 2.87,134.72 8.34,134.72 8.34,131.17"
    },
    {
      "name": "South Africa: South African Weather Service",
      "id": "urn:oid:2.49.0.0.710.0",
      "author": "Reagan.Rakau@weathersa.co.za",
      "countryCode": "ZAF",
      "polygon": "-21,14 -36,14 -36,34 -21,34 -21,14"
    },
    {
      "name": "Iceland: Icelandic Meteorological Office",
      "id": "urn:oid:2.49.0.0.352.0",
      "author": "sigk@vedur.is",
      "countryCode": "ISL",
      "polygon": "67.0,-25 62.8,-25 62.8,-13 67.0,-13 67.0,-25"
    },
    {
      "name": "Philippines: Philippine Atmospheric Geophysical and Astronomical Services Administration",
      "id": "urn:oid:2.49.0.0.608.0",
      "author": "arnel_manoos@yahoo.com",
      "countryCode": "PHL",
      "polygon": "19,117 5,117 5,127 19,127 19,117"
    },
    {
      "name": "Russian Federation: Russian Federal Service for Hydrometeorology and Environmental Monitoring",
      "id": "urn:oid:2.49.0.0.643.0",
      "author": "kiktev@mecom.ru",
      "countryCode": "RUS",
      "polygon": "81.9,191 41.1,191 41.1,19.7 81.9,19.7 81.9,191"
    },
    {
      "name": "Fiji: Fiji Meteorological Service",
      "id": "urn:oid:2.49.0.0.242.0",
      "author": "adarsh.kumar@met.gov.fj",
      "countryCode": "FJI"
    },
    {
      "name": "Brazil: Universidade de Brasília - Observatório Sismológico",
      "id": "urn:oid:2.49.0.0.76.1",
      "author": "jmauro.rezende@inmet.gov.br",
      "countryCode": "BRA"
    },
    {
      "name": "EUMETNET: EUMETNET",
      "id": "urn:oid:2.49.0.2.0",
      "author": "alexander.beck@zamg.ac.at",
      "countryCode": "EUM",
      "polygon": "71,-25 33,-25 33,35 71,35 71,-25"
    },
    {
      "name": "Chile: Direccion Meteorologica de Chile",
      "id": "urn:oid:2.49.0.0.152.0",
      "author": "puribe@dgac.gob.cl",
      "countryCode": "CHL",
      "polygon": "-17,-76.1 -56,-76.1 -56,-67.0 -17,-67.0 -17,-76.1"
    },
    {
      "name": "Netherlands: Royal Netherlands Meteorological Institute",
      "id": "urn:oid:2.49.0.0.528.0",
      "author": "Frank.Kroonenberg@knmi.nl",
      "countryCode": "NLD",
      "polygon": "55.4,2.0 50.7,2.0 50.7,7.3 55.4,7.3 55.4,2.0"
    },
    {
      "name": "Austria: Zentralanstalt für Meteorologie und Geodynamik",
      "id": "urn:oid:2.49.0.0.40.0",
      "author": "petra.habersatter@zamg.ac.at",
      "countryCode": "AUT",
      "polygon": "49.1,9.4 46.3,9.4 46.3,17.3 49.1,17.3 49.1,9.4"
    },
    {
      "name": "Canada: Environment and Climate Change Canada, Meteorological Service of Canada",
      "id": "urn:oid:2.49.0.0.124.0",
      "author": "norm.paulsen@ec.gc.ca",
      "countryCode": "CAN",
      "polygon": "87.61,-145.27 37.3,-145.27 37.3,-48.11 87.61,-48.11 87.61,-145.27"
    },
    {
      "name": "Romania: National Meteorological Administration",
      "id": "urn:oid:2.49.0.0.642.0",
      "author": "florinela.georgescu@meteoromania.ro",
      "countryCode": "ROM"
    },
    {
      "name": "Netherlands: Aruba Meteorological Department",
      "id": "urn:oid:2.49.0.0.528.3",
      "author": "frank.kroonenberg@knmi.nl",
      "countryCode": "NLD",
      "polygon": "12.74,-70.24 12.26,-70.24 12.26,-69.72 12.74,-69.72 12.74,-70.24"
    },
    {
      "name": "Anguilla: Disaster Management  Anguilla",
      "id": "urn:oid:2.49.0.0.660.0",
      "author": "GDe_Souza@cmo.org.tt",
      "countryCode": "AIA",
      "polygon": "18.40,-63.30 18.13,-63.30 18.13,-62.81 18.40,-62.81 18.40,-63.30"
    },
    {
      "name": "New Zealand: Ministry for Primary Industries",
      "id": "urn:oid:2.49.0.0.554.7",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "New Zealand: New Zealand Transport Agency",
      "id": "urn:oid:2.49.0.0.554.6",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34,166 -47,166 -47,179 -34,179 -34,166"
    },
    {
      "name": "New Zealand: New Zealand Police",
      "id": "urn:oid:2.49.0.0.554.5",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34,166 -47,166 -47,179 -34,179 -34,166"
    },
    {
      "name": "New Zealand: Fire and Emergency New Zealand",
      "id": "urn:oid:2.49.0.0.554.4",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34.000,166.00 -48.000,166.00 -48.000,179.000 -34.000,179.000 -34.000,166.00"
    },
    {
      "name": "Kuwait: Meteorological Department",
      "id": "urn:oid:2.49.0.0.414.0",
      "author": "m.almayyas@met.gov.kw",
      "countryCode": "KWT",
      "polygon": "30.1,46.5 28.5,46.5 28.5,48.7 30.1,48.7 30.1,46.5"
    },
    {
      "name": "New Zealand: Ministry of Health",
      "id": "urn:oid:2.49.0.0.554.3",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34,166 -47,166 -47,179 -34,179 -34,166"
    },
    {
      "name": "Netherlands: Rijkswaterstaat",
      "id": "urn:oid:2.49.0.0.528.2",
      "author": "Frank.Kroonenberg@knmi.nl",
      "countryCode": "NLD",
      "polygon": "54.1,2.2 50.7,2.2 50.7,7.2 54.1,7.2 54.1,2.2"
    },
    {
      "name": "New Zealand: GNS Science",
      "id": "urn:oid:2.49.0.0.554.1",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL",
      "polygon": "-34.000,166.00 -48.000,166.00 -48.000,179.000 -34.000,179.000 -34.000,166.00"
    },
    {
      "name": "Finland: Finnish Meteorological Institute",
      "id": "urn:oid:2.49.0.0.246.0",
      "author": "kristiina.santti@fmi.fi",
      "countryCode": "FIN",
      "polygon": "70,20 59,20 59,32 70,32 70,20"
    },
    {
      "name": "Trinidad and Tobago: Meteorological Service",
      "id": "urn:oid:2.49.0.0.780.0",
      "author": "marlon.noel@gmail.com",
      "countryCode": "TTO"
    },
    {
      "name": "Italy: Italian Civil Protecion in cooperation with italian region civil protecion structures",
      "id": "urn:oid:2.49.0.0.380.1",
      "author": "andrea.sabbatini@aeronautica.difesa.it",
      "countryCode": "ITA",
      "polygon": "48,6 36,6 36,19 48,19 48,6"
    },
    {
      "name": "Mexico: CONAGUA - Servicio Meteorologico Nacional de Mexico",
      "id": "urn:oid:2.49.0.0.484.0",
      "author": "jmanuel.caballero@conagua.gob.mx",
      "countryCode": "MEX"
    },
    {
      "name": "Canada: Natural Resources Canada",
      "id": "urn:oid:2.49.0.0.124.1",
      "author": "norm.paulsen@ec.gc.ca",
      "countryCode": "CAN",
      "polygon": "84,-145 41,-145 41,-45 84,-45 84,-145"
    },
    {
      "name": "Myanmar: Department of Meteorology and Hydrology",
      "id": "urn:oid:2.49.0.0.104.0",
      "author": "kyawlwinoo5@gmail.com",
      "countryCode": "MMR",
      "polygon": "29,92 9,92 9,102 29,102 29,92"
    },
    {
      "name": "Brazil: Instituto Nacional de Meteorologia - INMET",
      "id": "urn:oid:2.49.0.0.76.0",
      "author": "jmauro.rezende@inmet.gov.br",
      "countryCode": "BRA",
      "polygon": "7,-76 -34,-76 -34,-30 7,-30 7,-76"
    },
    {
      "name": "Italy: Ministry of Interior - Department of firefighters, public rescue and civil defense",
      "id": "urn:oid:2.49.0.0.380.2",
      "author": "andrea.sabbatini@aeronautica.difesa.it",
      "countryCode": "ITA",
      "polygon": "48,6 36,6 36,19 48,19 48,6"
    },
    {
      "name": "Cayman Islands: Cayman Islands National Weather Service",
      "id": "urn:oid:2.49.0.0.136.0",
      "author": "GDe_Souza@cmo.org.tt",
      "countryCode": "CYM",
      "polygon": "19.86,-81.6 18.99,-81.6 18.99,-79.6 19.86,-79.6 19.86,-81.6"
    },
    {
      "name": "Argentina: Instituto Nacional del Agua",
      "id": "urn:oid:2.49.0.0.32.1",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG",
      "polygon": "-21.6,-67 -40,-67 -40,-53.2 -21.6,-53.2 -21.6,-67"
    },
    {
      "name": "Singapore: Meteorological Services Singapore",
      "id": "urn:oid:2.49.0.0.702.0",
      "author": "chow_kwok_wah@nea.gov.sg",
      "countryCode": "SGP",
      "polygon": "1.48,103.60 1.19,103.60 1.19,104.09 1.48,104.09 1.48,103.60"
    },
    {
      "name": "French Polynesia: DIRECTION DE LA DEFENSE ET DE LA PROTECTION CIVILE",
      "id": "urn:oid:2.49.0.0.258.1",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "PYF",
      "polygon": "-8,-153 -28,-153 -28,-135 -8,-135 -8,-153"
    },
    {
      "name": "French Polynesia: Météo France",
      "id": "urn:oid:2.49.0.0.258.0",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "PYF",
      "polygon": "-8,-153 -28,-153 -28,-135 -8,-135 -8,-153"
    },
    {
      "name": "Argentina: Servicio de Hidrografía Naval - Ministerio de Defensa",
      "id": "urn:oid:2.49.0.0.32.2",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG",
      "polygon": "-34.11,-58.7 -38.16,-58.7 -38.16,-55.05 -34.11,-55.05 -34.11,-58.7"
    },
    {
      "name": "United Kingdom of Great Britain and Northern Ireland: Met Office",
      "id": "urn:oid:2.49.0.0.826.0",
      "author": "fiona.green@metoffice.gov.uk",
      "countryCode": "GBR",
      "polygon": "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8"
    },
    {
      "name": "Switzerland: Federal Office for Civil Protection, National Emergency Operation Centre, Nationale Alarmzentrale, Bundesamt für Bevölkerungsschutz",
      "id": "urn:oid:2.49.0.0.756.4",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE",
      "polygon": "47.9,5.9 45.7,5.9 45.7,10.7 47.9,10.7 47.9,5.9"
    },
    {
      "name": "New Caledonia: Securite civile de la Nouvelle Caledonie",
      "id": "urn:oid:2.49.0.0.540.1",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "NCL"
    },
    {
      "name": "New Caledonia: Météo France",
      "id": "urn:oid:2.49.0.0.540.0",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "NCL",
      "polygon": "-19.6,163.6 -22.7,163.6 -22.7,168.1 -19.6,168.1 -19.6,163.6"
    },
    {
      "name": "Germany: Deutscher Wetterdienst",
      "id": "urn:oid:2.49.0.0.276.0",
      "author": "BI@dwd.de",
      "countryCode": "DEU",
      "polygon": "55.1,5.7 47.3,5.7 47.3,15.0 55.1,15.0 55.1,5.7"
    },
    {
      "name": "Bahrain: Bahrain Meteorological Service",
      "id": "urn:oid:2.49.0.0.48.0",
      "author": "atarrar@caa.gov.bh",
      "countryCode": "BHR",
      "polygon": "26.28,50.45 25.80,50.45 25.80,50.66 26.28,50.66 26.28,50.45"
    },
    {
      "name": "Guinea-Bissau: The epedimologique Health Service of Guinea-Bissau",
      "id": "urn:oid:2.49.0.0.624.3",
      "author": "cherno_lm@yahoo.fr",
      "countryCode": "GNB",
      "polygon": "12.8,-16.5 11.0,-16.5 11.0,-13.3 12.8,-13.3 12.8,-16.5"
    },
    {
      "name": "El Salvador: Servicio Nacional de Estudios Territoriales",
      "id": "urn:oid:2.49.0.0.222.0",
      "author": "luis_guirola@yahoo.com",
      "countryCode": "SLV",
      "polygon": "14.6,-90.1 13.1,-90.1 13.1,-87.4 14.6,-87.4 14.6,-90.1"
    },
    {
      "name": "Guinea-Bissau: Ministere of the health of the Guinea-Bissau",
      "id": "urn:oid:2.49.0.0.624.4",
      "author": "cherno_lm@yahoo.fr",
      "countryCode": "GNB"
    },
    {
      "name": "Malta: Meteorological Office",
      "id": "urn:oid:2.49.0.0.470.0",
      "author": "joseph.schiavone@maltairport.com",
      "countryCode": "MLT"
    },
    {
      "name": "Azerbaijan: Hydrometeorological Institute of the Ministry of Ecology and Natural Resources",
      "id": "urn:oid:2.49.0.0.31.0",
      "author": "abbasov@hotmail.com",
      "countryCode": "AZE"
    },
    {
      "name": "Bosnia and Herzegovina: Federal Hydrometeorological Institute of Federation of Bosnia and Herzegovina",
      "id": "urn:oid:2.49.0.0.70.0",
      "author": "i.kovacic@rhmzrs.com",
      "countryCode": "BIH",
      "polygon": "45.3,15.6 42.5,15.6 42.5,19.7 45.3,19.7 45.3,15.6"
    },
    {
      "name": "Bosnia and Herzegovina: Republic Hydrometeorological Service of Republic of Srpska",
      "id": "urn:oid:2.49.0.0.70.1",
      "author": "i.kovacic@rhmzrs.com",
      "countryCode": "BIH",
      "polygon": "45.3,15.6 42.5,15.6 42.5,19.7 45.3,19.7 45.3,15.6"
    },
    {
      "name": "Latvia: Latvian Environment, Geology and Meteorology Centre (LEGMC)",
      "id": "urn:oid:2.49.0.0.428.0",
      "author": "andris.viksna@lvgmc.lv",
      "countryCode": "LVA",
      "polygon": "58.2,19.9 55.6,19.9 55.6,28.3 58.2,28.3 58.2,19.9"
    },
    {
      "name": "Netherlands: Wageningen University and Research Centre",
      "id": "urn:oid:2.49.0.0.528.1",
      "author": "Frank.Kroonenberg@knmi.nl",
      "countryCode": "NLD"
    },
    {
      "name": "Ireland: Met Eireann - Irish Meteorological Service",
      "id": "urn:oid:2.49.0.0.372.0",
      "author": "gerald.fleming@met.ie",
      "countryCode": "IRL",
      "polygon": "55.5,-13.6 50.6,-13.6 50.6,-5.7 55.5,-5.7 55.5,-13.6"
    },
    {
      "name": "Portugal: Instituto Português do Mar e da Atmosfera, I.P.",
      "id": "urn:oid:2.49.0.0.620.0",
      "author": "bruno.anjos@ipma.pt",
      "countryCode": "PRT",
      "polygon": "45,-40 30,-40 30,-6 45,-6 45,-40"
    },
    {
      "name": "Montenegro: Institute of Hydrometeorology and Seismology of Montenegro",
      "id": "urn:oid:2.49.0.0.499.0",
      "author": "vera.andrijasevic@meteo.co.me",
      "countryCode": "MNE",
      "polygon": "43.6,18.3 41.8,18.3 41.8,20.6 43.6,20.6 43.6,18.3"
    },
    {
      "name": "Jordan: Jordan Meteorological Department",
      "id": "urn:oid:2.49.0.0.400.0",
      "author": "ahmed_hallaj@hotmail.com",
      "countryCode": "JOR",
      "polygon": "33.5,35.1 29.0,35.1 29.0,39.0 33.5,39.0 33.5,35.1"
    },
    {
      "name": "Antigua and Barbuda: Meteorological Services",
      "id": "urn:oid:2.49.0.0.28.0",
      "author": "keithleym@yahoo.com",
      "countryCode": "ATG",
      "polygon": "17.73,-61.91 17.00,-61.91 17.00,-61.67 17.73,-61.67 17.73,-61.91"
    },
    {
      "name": "United Arab Emirates: Meteorological Department",
      "id": "urn:oid:2.49.0.0.784.0",
      "author": "cfo@ncms.ae",
      "countryCode": "ARE"
    },
    {
      "name": "Greece: Hellenic National Meteorological Service",
      "id": "urn:oid:2.49.0.0.300.0",
      "author": "alalos@hnms.gr",
      "countryCode": "GRC"
    },
    {
      "name": "Belize: National Meteorological Service",
      "id": "urn:oid:2.49.0.0.84.0",
      "author": "dgonguez@hydromet.gov.bz",
      "countryCode": "BLZ",
      "polygon": "18.5,-89.2 15.9,-89.2 15.9,-88.0 18.5,-88.0 18.5,-89.2"
    },
    {
      "name": "Hungary: Hungarian Meteorological Service",
      "id": "urn:oid:2.49.0.0.348.0",
      "author": "labo.e@met.hu",
      "countryCode": "HUN",
      "polygon": "49.0,16.1 45.4,16.1 45.4,23.6 49.0,23.6 49.0,16.1"
    },
    {
      "name": "Republic of Moldova: State Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.498.0",
      "author": "lidia.trescilo@meteo.gov.md",
      "countryCode": "MDA",
      "polygon": "46.48,26.62 45.45,26.62 45.45,30.18 46.48,30.18 46.48,26.62"
    },
    {
      "name": "Saint Lucia: Meteorological Services",
      "id": "urn:oid:2.49.0.0.662.0",
      "author": "tauguste@gosl.gov.lc",
      "countryCode": "LCA",
      "polygon": "14.2,-61.3 13.8,-61.3 13.8,-60.0 14.2,-60.0 14.2,-61.3"
    },
    {
      "name": "Japan: Japan Meteorological Agency (JMA)",
      "id": "urn:oid:2.49.0.0.392.0",
      "author": "iao-jma@met.kishou.go.jp",
      "countryCode": "JPN",
      "polygon": "46.0,154.0 24.0,154.0 24.0,122.0 46.0,122.0 46.0,154.0"
    },
    {
      "name": "Bhutan: National Center for Hydrology and Meteorology",
      "id": "urn:oid:2.49.0.0.64.1",
      "author": "phuntsho.dhms@gmail.com",
      "countryCode": "BTN",
      "polygon": "28.5,88.8 26.5,88.8 26.5,92.4 28.5,92.4 28.5,88.8"
    },
    {
      "name": "Poland: Institute of Meteorology and Water Management",
      "id": "urn:oid:2.49.0.0.616.0",
      "author": "teresa.zawislak@imgw.pl",
      "countryCode": "POL",
      "polygon": "55.2,14.0 49.8,14.0 49.8,23.8 55.2,23.8 55.2,14.0"
    },
    {
      "name": "Switzerland: WSL Institute for Snow and Avalanche Research SLF, WSL-Institut für Schnee- und Lawinenforschung SLF",
      "id": "urn:oid:2.49.0.0.756.3",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE",
      "polygon": "47.89,5.91 45.72,5.91 45.72,10.68 47.89,10.68 47.89,5.91"
    },
    {
      "name": "Switzerland: Swiss Seismological Service, Schweizerischer Erdbebendienst",
      "id": "urn:oid:2.49.0.0.756.2",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE",
      "polygon": "47.89,5.91 45.72,5.91 45.72,10.68 47.89,10.68 47.89,5.91"
    },
    {
      "name": "Switzerland: Federal Office for the Environment, Bundesamt für Umwelt",
      "id": "urn:oid:2.49.0.0.756.1",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE",
      "polygon": "47.89,5.91 45.72,5.91 45.72,10.68 47.89,10.68 47.89,5.91"
    },
    {
      "name": "Switzerland: MeteoSwiss, Bundesamt für Meteorologie und Klimatologie",
      "id": "urn:oid:2.49.0.0.756.0",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE",
      "polygon": "47.89,5.91 45.72,5.91 45.72,10.68 47.89,10.68 47.89,5.91"
    },
    {
      "name": "Angola: Instituto Nacional de Hidrometeorología e Geofísica",
      "id": "urn:oid:2.49.0.0.24.0",
      "author": "francisco.neto@inamet.gov.ao",
      "countryCode": "AGO"
    },
    {
      "name": "Yemen: Yemen Meteorological Service",
      "id": "urn:oid:2.49.0.0.887.0",
      "author": "alsabriagm@hotmail.com",
      "countryCode": "YEM"
    },
    {
      "name": "Pakistan: Pakistan Meteorological Department",
      "id": "urn:oid:2.49.0.0.586.0",
      "author": "hazratmir2007@yahoo.com",
      "countryCode": "PAK"
    },
    {
      "name": "Slovenia: Civil Protection and Disaster Relief Administration of the Republic of Slovenia - URSZR",
      "id": "urn:oid:2.49.0.0.705.10",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN",
      "polygon": "46.9,13.4 45.3,13.4 45.3,16.7 46.9,16.7 46.9,13.4"
    },
    {
      "name": "Slovenia: National Seismological Service (ARSO - Slovenian Environment Agency/Seismology and Geology Office)",
      "id": "urn:oid:2.49.0.0.705.3",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN",
      "polygon": "46.9,13.4 45.3,13.4 45.3,16.7 46.9,16.7 46.9,13.4"
    },
    {
      "name": "Slovenia: Slovenian Environment Agency - ARSO",
      "id": "urn:oid:2.49.0.0.705.0",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN",
      "polygon": "46.9,13.4 45.3,13.4 45.3,16.7 46.9,16.7 46.9,13.4"
    },
    {
      "name": "Slovenia: National Hydrological   Service (ARSO/hydro.si - Slovenian Environment Agency/Hydrology and State of the Environment Office)",
      "id": "urn:oid:2.49.0.0.705.2",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN",
      "polygon": "46.9,13.4 45.3,13.4 45.3,16.7 46.9,16.7 46.9,13.4"
    },
    {
      "name": "Slovenia: National Meteorological Service (ARSO/meteo.si - Slovenian Environment Agency/Meteorological Office)",
      "id": "urn:oid:2.49.0.0.705.1",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN",
      "polygon": "46.9,13.4 45.3,13.4 45.3,16.7 46.9,16.7 46.9,13.4"
    },
    {
      "name": "Brunei Darussalam: Brunei Meteorological Service",
      "id": "urn:oid:2.49.0.0.96.0",
      "author": "rokiah.angas@gmail.com",
      "countryCode": "BRN"
    },
    {
      "name": "Slovakia: Slovak Hydrometeorological Institute",
      "id": "urn:oid:2.49.0.0.703.0",
      "author": "martin.benko@shmu.sk",
      "countryCode": "SVK",
      "polygon": "49.7,16.8 47.6,16.8 47.6,22.6 49.7,22.6 49.7,16.8"
    },
    {
      "name": "Iran (Islamic Republic of): Islamic Republic of Iran Meteorological Organization",
      "id": "urn:oid:2.49.0.0.364.0",
      "author": "sahartajbakhsh@gmail.com",
      "countryCode": "IRN",
      "polygon": "40,44 25,44 25,63 40,63 40,44"
    },
    {
      "name": "Ukraine: State Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.804.0",
      "author": "reviakin@meteo.gov.ua",
      "countryCode": "UKR",
      "polygon": "53.3,21 43.6,21 43.6,41 53.3,41 53.3,21"
    },
    {
      "name": "Vanuatu: Vanuatu Meteorological Services",
      "id": "urn:oid:2.49.0.0.548.0",
      "author": "patou@meteo.gov.vu",
      "countryCode": "VUT"
    },
    {
      "name": "Lithuania: Lithuanian Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.440.0",
      "author": "vida.raliene@meteo.lt",
      "countryCode": "LTU",
      "polygon": "56.7,20.9 53.6,20.9 53.6,27.3 56.7,27.3 56.7,20.9"
    },
    {
      "name": "Bangladesh: Bangladesh Meteorological Department",
      "id": "urn:oid:2.49.0.0.50.0",
      "author": "muzammel_tarafder@yahoo.com",
      "countryCode": "BGD"
    },
    {
      "name": "France: Météo-France",
      "id": "urn:oid:2.49.0.0.250.0",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "FRA",
      "polygon": "51.1,-5 41.4,-5 41.4,10 51.1,10 51.1,-5"
    },
    {
      "name": "Sudan: Sudan Meteorological Authority",
      "id": "urn:oid:2.49.0.0.729.0",
      "author": "sharaf@ersad.gov.sd",
      "countryCode": "SDN",
      "polygon": "16.13,24.61 9.96,24.61 9.96,29.53 16.13,29.53 16.13,24.61"
    },
    {
      "name": "Malaysia: Malaysian Meteorological Department",
      "id": "urn:oid:2.49.0.0.458.0",
      "author": "ramlan@met.gov.my",
      "countryCode": "MYS",
      "polygon": "3.83,109.80 3.83,109.80 3.83,109.80 3.83,109.80 3.83,109.80"
    }
  ];

  return data;
};

export const classes = (...args) => args.filter(c => !!c).join(' ');

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
  setter(old => ({ ...old, ...data }));
};

export const camelise = (str: string) => {
  const words = str.toLowerCase().split(' ');
  let ret = words[0];
  for (let i = 1; i < words.length; i++) {
    ret += words[i][0].toUpperCase() + words[i].substring(1);
  }
  return ret;
};

export const fetcher = (...args) => fetch(...args).then(res => res.json());
