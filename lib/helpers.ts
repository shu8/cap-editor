import { XMLParser } from "fast-xml-parser";

export const fetchWMOAlertingAuthorities = async () => {
  // const result = await fetch(
  //   "https://alertingauthority.wmo.int/rss.xml"
  // ).then((res) => res.text());

  // const parser = new XMLParser();
  // const alertingAuthorities = parser.parse(result);

  // const data = alertingAuthorities.rss.channel.item.map((i: any) => ({
  //   name: i.title,
  //   id: i.id,
  //   author: i.author,
  //   countryCode: i["iso:countrycode"],
  // }));

  const data = [
    {
      "name": "Croatia: Croatian Meteorological and Hydrological Service",
      "id": "urn:oid:2.49.0.0.191.0",
      "author": "tanja.renko@cirus.dhz.hr",
      "countryCode": "HRV"
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
      "countryCode": "URY"
    },
    {
      "name": "Serbia: Republic Hydrometeorological Service of Serbia",
      "id": "urn:oid:2.49.0.0.688.0",
      "author": "goran.mihajlovic@hidmet.gov.rs",
      "countryCode": "SRB"
    },
    {
      "name": "Zambia: Zambia Meteorological Department",
      "id": "urn:oid:2.49.0.0.894.0",
      "author": "peggytholezulu@gmail.com",
      "countryCode": "ZMB"
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
      "countryCode": "NOR"
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
      "countryCode": "ITA"
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
      "countryCode": "DNK"
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
      "countryCode": "STP"
    },
    {
      "name": "Mauritania: Office National de la Météorologie",
      "id": "urn:oid:2.49.0.0.478.0",
      "author": "sidiloudey2@yahoo.fr",
      "countryCode": "MRT"
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
      "countryCode": "AND"
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
      "countryCode": "AUT"
    },
    {
      "name": "Austria: Amt der Vorarlberger Landesregierung. Wasserwirtschaft",
      "id": "urn:oid:2.49.0.0.40.5",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUT"
    },
    {
      "name": "Austria: Hydrographischer Dienst Tirol",
      "id": "urn:oid:2.49.0.0.40.6",
      "author": "wmoraa@wmo.int",
      "countryCode": "AUT"
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
      "countryCode": "GBR"
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
      "countryCode": "CAN"
    },
    {
      "name": "Canada: Ministère de la Sécurité publique du Québec",
      "id": "urn:oid:2.49.0.0.124.3",
      "author": "wmoraa@wmo.int",
      "countryCode": "CAN"
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
      "countryCode": "CYP"
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
      "countryCode": "MDG"
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
      "countryCode": "NIU"
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
      "countryCode": "SSD"
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
      "countryCode": "SUR"
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
      "countryCode": "TUR"
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
      "countryCode": "TUV"
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
      "countryCode": "USA"
    },
    {
      "name": "United States of America: Federal Emergency Management Agency, Integrated Public Alert and Warning System",
      "id": "urn:oid:2.49.0.0.840.4",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA"
    },
    {
      "name": "United States of America: National Oceanic and Atmospheric Administration (NOAA), National Tsunami Warning Center",
      "id": "urn:oid:2.49.0.0.840.1",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA"
    },
    {
      "name": "United States of America: National Oceanic and Atmospheric Administration (NOAA), National Weather Service",
      "id": "urn:oid:2.49.0.0.840.0",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA"
    },
    {
      "name": "United States of America: United States Geological Survey, Earthquakes",
      "id": "urn:oid:2.49.0.0.840.2",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA"
    },
    {
      "name": "United States of America: United States Geological Survey, Volcano Hazards Program",
      "id": "urn:oid:2.49.0.0.840.5",
      "author": "wmoraa@wmo.int",
      "countryCode": "USA"
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
      "countryCode": "THA"
    },
    {
      "name": "Togo: Direction Générale de la météorologie Nationale",
      "id": "urn:oid:2.49.0.0.768.0",
      "author": "ablaagb@yahoo.fr",
      "countryCode": "TGO"
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
      "countryCode": "EGY"
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
      "countryCode": "COG"
    },
    {
      "name": "Thailand: National Disaster Warning Center (NDWC)",
      "id": "urn:oid:2.49.0.0.764.1",
      "author": "webmaster@tmd.go.th",
      "countryCode": "THA"
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
      "countryCode": "NZL"
    },
    {
      "name": "Burundi: Institut Géographique du Burundi",
      "id": "urn:oid:2.49.0.0.108.0",
      "author": "ngendadonatien@gmail.com",
      "countryCode": "BDI"
    },
    {
      "name": "Eswatini: Eswatini Meteorological Service",
      "id": "urn:oid:2.49.0.0.748.0",
      "author": "ncongwanemusa@gmail.com",
      "countryCode": "SWZ"
    },
    {
      "name": "Democratic Republic of the Congo: Agence Nationale de la Météorologie et de Télédétection par Satellite",
      "id": "urn:oid:2.49.0.0.180.0",
      "author": "mpwomwenge@gmail.com",
      "countryCode": "COD"
    },
    {
      "name": "Mozambique: Instituto Nacional de Meteorologia",
      "id": "urn:oid:2.49.0.0.508.0",
      "author": "mussa2503@gmail.com",
      "countryCode": "MOZ"
    },
    {
      "name": "Maldives: National Disaster Management Authority",
      "id": "urn:oid:2.49.0.0.462.1",
      "author": "ali.shareef@met.gov.mv",
      "countryCode": "MDV"
    },
    {
      "name": "Maldives: Maldives Meteorological Service",
      "id": "urn:oid:2.49.0.0.462.0",
      "author": "ali.shareef@met.gov.mv",
      "countryCode": "MDV"
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
      "countryCode": "CRI"
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
      "countryCode": "COM"
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
      "countryCode": "PRY"
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
      "countryCode": "SYC"
    },
    {
      "name": "Tunisia: National Institute of Meteorology",
      "id": "urn:oid:2.49.0.0.788.0",
      "author": "bassem.nahhali@meteo.tn",
      "countryCode": "TUN"
    },
    {
      "name": "Botswana: Botswana Meteorological Services",
      "id": "urn:oid:2.49.0.0.72.0",
      "author": "jkeretetse@gov.bw",
      "countryCode": "BWA"
    },
    {
      "name": "United Kingdom of Great Britain and Northern Ireland: Bermuda Weather Service",
      "id": "urn:oid:2.49.0.0.826.3",
      "author": "mguishard@airportauthority.bm",
      "countryCode": "GBR"
    },
    {
      "name": "Mauritius: Mauritius Meteorological Services",
      "id": "urn:oid:2.49.0.0.480.0",
      "author": "sadrame75@gmail.com",
      "countryCode": "MUS"
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
      "countryCode": "KEN"
    },
    {
      "name": "Lesotho: Lesotho Meteorological Services",
      "id": "urn:oid:2.49.0.0.426.0",
      "author": "srsmphahama@gmail.com",
      "countryCode": "LSO"
    },
    {
      "name": "United Republic of Tanzania: Disaster Management Department-PMO",
      "id": "urn:oid:2.49.0.0.834.1",
      "author": "samwel.mbuya@meteo.go.tz",
      "countryCode": "TZA"
    },
    {
      "name": "Spain: Agencia Estatal de Meteorología",
      "id": "urn:oid:2.49.0.0.724.0",
      "author": "jreyv@aemet.es",
      "countryCode": "ESP"
    },
    {
      "name": "United Republic of Tanzania: Tanzania Meteorological Authority",
      "id": "urn:oid:2.49.0.0.834.0",
      "author": "samwel.mbuya@meteo.go.tz",
      "countryCode": "TZA"
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
      "countryCode": "ECU"
    },
    {
      "name": "Hong Kong, China: Hong Kong Observatory",
      "id": "urn:oid:2.49.0.0.344.0",
      "author": "hyyeung@hko.gov.hk",
      "countryCode": "HKG"
    },
    {
      "name": "Argentina: Servicio Meteorologico Nacional",
      "id": "urn:oid:2.49.0.0.32.0",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG"
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
      "countryCode": "CHN"
    },
    {
      "name": "New Zealand: National Emergency Management Agency",
      "id": "urn:oid:2.49.0.0.554.2",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "Oman: Directorate General of Meteorology",
      "id": "urn:oid:2.49.0.0.512.0",
      "author": "j.almaskari@met.gov.om",
      "countryCode": "OMN"
    },
    {
      "name": "Antigua and Barbuda: Antigua and Barbuda Meteorological Service",
      "id": "urn:oid:2.49.0.0.28.78862",
      "author": "keithleym@yahoo.com",
      "countryCode": "ATG"
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
      "countryCode": "IND"
    },
    {
      "name": "Norway: Norwegian Meteorological Institute",
      "id": "urn:oid:2.49.0.0.578.0",
      "author": "gjermund.m.haugen@met.no",
      "countryCode": "NOR"
    },
    {
      "name": "Indonesia: Agency for Meteorology Climatology and Geophysics of Republic Indonesia",
      "id": "urn:oid:2.49.0.0.360.0",
      "author": "agiewandala@gmail.com",
      "countryCode": "IDN"
    },
    {
      "name": "Czechia: Czech Hydrometeorological Institute",
      "id": "urn:oid:2.49.0.0.203.0",
      "author": "pavel.borovicka@chmi.cz",
      "countryCode": "CZE"
    },
    {
      "name": "Barbados: Barbados Meteorological Services",
      "id": "urn:oid:2.49.0.0.52.0",
      "author": "sonia.nurse@barbados.gov.bb",
      "countryCode": "BRB"
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
      "countryCode": "GUY"
    },
    {
      "name": "United States of America: Palau Weather Service Office",
      "id": "urn:oid:2.49.0.0.585.0",
      "author": "mark.paese@noaa.gov",
      "countryCode": "USA"
    },
    {
      "name": "South Africa: South African Weather Service",
      "id": "urn:oid:2.49.0.0.710.0",
      "author": "Reagan.Rakau@weathersa.co.za",
      "countryCode": "ZAF"
    },
    {
      "name": "Iceland: Icelandic Meteorological Office",
      "id": "urn:oid:2.49.0.0.352.0",
      "author": "sigk@vedur.is",
      "countryCode": "ISL"
    },
    {
      "name": "Philippines: Philippine Atmospheric Geophysical and Astronomical Services Administration",
      "id": "urn:oid:2.49.0.0.608.0",
      "author": "arnel_manoos@yahoo.com",
      "countryCode": "PHL"
    },
    {
      "name": "Russian Federation: Russian Federal Service for Hydrometeorology and Environmental Monitoring",
      "id": "urn:oid:2.49.0.0.643.0",
      "author": "kiktev@mecom.ru",
      "countryCode": "RUS"
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
      "countryCode": "EUM"
    },
    {
      "name": "Chile: Direccion Meteorologica de Chile",
      "id": "urn:oid:2.49.0.0.152.0",
      "author": "puribe@dgac.gob.cl",
      "countryCode": "CHL"
    },
    {
      "name": "Netherlands: Royal Netherlands Meteorological Institute",
      "id": "urn:oid:2.49.0.0.528.0",
      "author": "Frank.Kroonenberg@knmi.nl",
      "countryCode": "NLD"
    },
    {
      "name": "Austria: Zentralanstalt für Meteorologie und Geodynamik",
      "id": "urn:oid:2.49.0.0.40.0",
      "author": "petra.habersatter@zamg.ac.at",
      "countryCode": "AUT"
    },
    {
      "name": "Canada: Environment and Climate Change Canada, Meteorological Service of Canada",
      "id": "urn:oid:2.49.0.0.124.0",
      "author": "norm.paulsen@ec.gc.ca",
      "countryCode": "CAN"
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
      "countryCode": "NLD"
    },
    {
      "name": "Anguilla: Disaster Management  Anguilla",
      "id": "urn:oid:2.49.0.0.660.0",
      "author": "GDe_Souza@cmo.org.tt",
      "countryCode": "AIA"
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
      "countryCode": "NZL"
    },
    {
      "name": "New Zealand: New Zealand Police",
      "id": "urn:oid:2.49.0.0.554.5",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "New Zealand: Fire and Emergency New Zealand",
      "id": "urn:oid:2.49.0.0.554.4",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "Kuwait: Meteorological Department",
      "id": "urn:oid:2.49.0.0.414.0",
      "author": "m.almayyas@met.gov.kw",
      "countryCode": "KWT"
    },
    {
      "name": "New Zealand: Ministry of Health",
      "id": "urn:oid:2.49.0.0.554.3",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "Netherlands: Rijkswaterstaat",
      "id": "urn:oid:2.49.0.0.528.2",
      "author": "Frank.Kroonenberg@knmi.nl",
      "countryCode": "NLD"
    },
    {
      "name": "New Zealand: GNS Science",
      "id": "urn:oid:2.49.0.0.554.1",
      "author": "peter.kreft@metservice.com",
      "countryCode": "NZL"
    },
    {
      "name": "Finland: Finnish Meteorological Institute",
      "id": "urn:oid:2.49.0.0.246.0",
      "author": "kristiina.santti@fmi.fi",
      "countryCode": "FIN"
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
      "countryCode": "ITA"
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
      "countryCode": "CAN"
    },
    {
      "name": "Myanmar: Department of Meteorology and Hydrology",
      "id": "urn:oid:2.49.0.0.104.0",
      "author": "kyawlwinoo5@gmail.com",
      "countryCode": "MMR"
    },
    {
      "name": "Brazil: Instituto Nacional de Meteorologia - INMET",
      "id": "urn:oid:2.49.0.0.76.0",
      "author": "jmauro.rezende@inmet.gov.br",
      "countryCode": "BRA"
    },
    {
      "name": "Italy: Ministry of Interior - Department of firefighters, public rescue and civil defense",
      "id": "urn:oid:2.49.0.0.380.2",
      "author": "andrea.sabbatini@aeronautica.difesa.it",
      "countryCode": "ITA"
    },
    {
      "name": "Cayman Islands: Cayman Islands National Weather Service",
      "id": "urn:oid:2.49.0.0.136.0",
      "author": "GDe_Souza@cmo.org.tt",
      "countryCode": "CYM"
    },
    {
      "name": "Argentina: Instituto Nacional del Agua",
      "id": "urn:oid:2.49.0.0.32.1",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG"
    },
    {
      "name": "Singapore: Meteorological Services Singapore",
      "id": "urn:oid:2.49.0.0.702.0",
      "author": "chow_kwok_wah@nea.gov.sg",
      "countryCode": "SGP"
    },
    {
      "name": "French Polynesia: DIRECTION DE LA DEFENSE ET DE LA PROTECTION CIVILE",
      "id": "urn:oid:2.49.0.0.258.1",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "PYF"
    },
    {
      "name": "French Polynesia: Météo France",
      "id": "urn:oid:2.49.0.0.258.0",
      "author": "laurent.perron@meteo.fr",
      "countryCode": "PYF"
    },
    {
      "name": "Argentina: Servicio de Hidrografía Naval - Ministerio de Defensa",
      "id": "urn:oid:2.49.0.0.32.2",
      "author": "ccampetella@smn.gov.ar",
      "countryCode": "ARG"
    },
    {
      "name": "United Kingdom of Great Britain and Northern Ireland: Met Office",
      "id": "urn:oid:2.49.0.0.826.0",
      "author": "fiona.green@metoffice.gov.uk",
      "countryCode": "GBR"
    },
    {
      "name": "Switzerland: Federal Office for Civil Protection, National Emergency Operation Centre, Nationale Alarmzentrale, Bundesamt für Bevölkerungsschutz",
      "id": "urn:oid:2.49.0.0.756.4",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE"
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
      "countryCode": "NCL"
    },
    {
      "name": "Germany: Deutscher Wetterdienst",
      "id": "urn:oid:2.49.0.0.276.0",
      "author": "BI@dwd.de",
      "countryCode": "DEU"
    },
    {
      "name": "Bahrain: Bahrain Meteorological Service",
      "id": "urn:oid:2.49.0.0.48.0",
      "author": "atarrar@caa.gov.bh",
      "countryCode": "BHR"
    },
    {
      "name": "Guinea-Bissau: The epedimologique Health Service of Guinea-Bissau",
      "id": "urn:oid:2.49.0.0.624.3",
      "author": "cherno_lm@yahoo.fr",
      "countryCode": "GNB"
    },
    {
      "name": "El Salvador: Servicio Nacional de Estudios Territoriales",
      "id": "urn:oid:2.49.0.0.222.0",
      "author": "luis_guirola@yahoo.com",
      "countryCode": "SLV"
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
      "countryCode": "BIH"
    },
    {
      "name": "Bosnia and Herzegovina: Republic Hydrometeorological Service of Republic of Srpska",
      "id": "urn:oid:2.49.0.0.70.1",
      "author": "i.kovacic@rhmzrs.com",
      "countryCode": "BIH"
    },
    {
      "name": "Latvia: Latvian Environment, Geology and Meteorology Centre (LEGMC)",
      "id": "urn:oid:2.49.0.0.428.0",
      "author": "andris.viksna@lvgmc.lv",
      "countryCode": "LVA"
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
      "countryCode": "IRL"
    },
    {
      "name": "Portugal: Instituto Português do Mar e da Atmosfera, I.P.",
      "id": "urn:oid:2.49.0.0.620.0",
      "author": "bruno.anjos@ipma.pt",
      "countryCode": "PRT"
    },
    {
      "name": "Montenegro: Institute of Hydrometeorology and Seismology of Montenegro",
      "id": "urn:oid:2.49.0.0.499.0",
      "author": "vera.andrijasevic@meteo.co.me",
      "countryCode": "MNE"
    },
    {
      "name": "Jordan: Jordan Meteorological Department",
      "id": "urn:oid:2.49.0.0.400.0",
      "author": "ahmed_hallaj@hotmail.com",
      "countryCode": "JOR"
    },
    {
      "name": "Antigua and Barbuda: Meteorological Services",
      "id": "urn:oid:2.49.0.0.28.0",
      "author": "keithleym@yahoo.com",
      "countryCode": "ATG"
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
      "countryCode": "BLZ"
    },
    {
      "name": "Hungary: Hungarian Meteorological Service",
      "id": "urn:oid:2.49.0.0.348.0",
      "author": "labo.e@met.hu",
      "countryCode": "HUN"
    },
    {
      "name": "Republic of Moldova: State Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.498.0",
      "author": "lidia.trescilo@meteo.gov.md",
      "countryCode": "MDA"
    },
    {
      "name": "Saint Lucia: Meteorological Services",
      "id": "urn:oid:2.49.0.0.662.0",
      "author": "tauguste@gosl.gov.lc",
      "countryCode": "LCA"
    },
    {
      "name": "Japan: Japan Meteorological Agency (JMA)",
      "id": "urn:oid:2.49.0.0.392.0",
      "author": "iao-jma@met.kishou.go.jp",
      "countryCode": "JPN"
    },
    {
      "name": "Bhutan: National Center for Hydrology and Meteorology",
      "id": "urn:oid:2.49.0.0.64.1",
      "author": "phuntsho.dhms@gmail.com",
      "countryCode": "BTN"
    },
    {
      "name": "Poland: Institute of Meteorology and Water Management",
      "id": "urn:oid:2.49.0.0.616.0",
      "author": "teresa.zawislak@imgw.pl",
      "countryCode": "POL"
    },
    {
      "name": "Switzerland: WSL Institute for Snow and Avalanche Research SLF, WSL-Institut für Schnee- und Lawinenforschung SLF",
      "id": "urn:oid:2.49.0.0.756.3",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE"
    },
    {
      "name": "Switzerland: Swiss Seismological Service, Schweizerischer Erdbebendienst",
      "id": "urn:oid:2.49.0.0.756.2",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE"
    },
    {
      "name": "Switzerland: Federal Office for the Environment, Bundesamt für Umwelt",
      "id": "urn:oid:2.49.0.0.756.1",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE"
    },
    {
      "name": "Switzerland: MeteoSwiss, Bundesamt für Meteorologie und Klimatologie",
      "id": "urn:oid:2.49.0.0.756.0",
      "author": "christoph.schmutz@meteoswiss.ch",
      "countryCode": "CHE"
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
      "countryCode": "SVN"
    },
    {
      "name": "Slovenia: National Seismological Service (ARSO - Slovenian Environment Agency/Seismology and Geology Office)",
      "id": "urn:oid:2.49.0.0.705.3",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN"
    },
    {
      "name": "Slovenia: Slovenian Environment Agency - ARSO",
      "id": "urn:oid:2.49.0.0.705.0",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN"
    },
    {
      "name": "Slovenia: National Hydrological   Service (ARSO/hydro.si - Slovenian Environment Agency/Hydrology and State of the Environment Office)",
      "id": "urn:oid:2.49.0.0.705.2",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN"
    },
    {
      "name": "Slovenia: National Meteorological Service (ARSO/meteo.si - Slovenian Environment Agency/Meteorological Office)",
      "id": "urn:oid:2.49.0.0.705.1",
      "author": "ales.poredos@gov.si",
      "countryCode": "SVN"
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
      "countryCode": "SVK"
    },
    {
      "name": "Iran (Islamic Republic of): Islamic Republic of Iran Meteorological Organization",
      "id": "urn:oid:2.49.0.0.364.0",
      "author": "sahartajbakhsh@gmail.com",
      "countryCode": "IRN"
    },
    {
      "name": "Ukraine: State Hydrometeorological Service",
      "id": "urn:oid:2.49.0.0.804.0",
      "author": "reviakin@meteo.gov.ua",
      "countryCode": "UKR"
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
      "countryCode": "LTU"
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
      "countryCode": "FRA"
    },
    {
      "name": "Sudan: Sudan Meteorological Authority",
      "id": "urn:oid:2.49.0.0.729.0",
      "author": "sharaf@ersad.gov.sd",
      "countryCode": "SDN"
    },
    {
      "name": "Malaysia: Malaysian Meteorological Department",
      "id": "urn:oid:2.49.0.0.458.0",
      "author": "ramlan@met.gov.my",
      "countryCode": "MYS"
    }
  ];

  return data;
};
