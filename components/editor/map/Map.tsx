import { t } from "@lingui/macro";
import { AlertingAuthority } from "@prisma/client";
import { Icon } from "@rsuite/icons";
import flip from "@turf/flip";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "rsuite";

import OLFeatureCollection from "ol/Collection";
import { singleClick } from "ol/events/condition";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import { Circle, Geometry, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { defaults as OLDefaultInteractions } from "ol/interaction";
import OLDraw from "ol/interaction/Draw";
import OLSelect from "ol/interaction/Select";
import OLMap from "ol/Map";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import OLVectorSource, { VectorSourceEvent } from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import OLView from "ol/View";

import { useMountEffect } from "../../../lib/helpers.client";
import { FormAlertData } from "../Editor";
import TileLayer from "./TileLayer";
import VectorLayer from "./VectorLayer";

// https://www.reshot.com/free-svg-icons/item/free-positioning-polygone-F2AWH4PGVQ/
const PolygonImage = () => (
  <Image
    src="/polygon.svg"
    width={25}
    height={25}
    title="Draw Polygon"
    alt="Draw Polygon"
  />
);

// Edited from https://www.reshot.com/free-svg-icons/item/circle-M5LDZF8VP2/
const CircleImage = () => (
  <Image
    src="/circle.svg"
    width={25}
    height={25}
    title="Draw Cirlce"
    alt="Draw Circle"
  />
);

const geojsonFormat = new GeoJSON();
const OSMSource = new OSM();
const selectedStyle = new Style({
  stroke: new Stroke({ color: "rgba(255, 0, 0, 0.2)" }),
  fill: new Fill({ color: "rgba(255, 0, 0, 0.2)" }),
});
const hoverStyle = new Style({
  stroke: new Stroke({ color: "rgba(0, 0, 255, 0.2)" }),
  fill: new Fill({ color: "rgba(0, 0, 255, 0.2)" }),
});
const defaultFeatureCountryStyle = new Style({
  stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)" }),
  fill: new Fill({ color: "rgba(255, 255, 255, 0.1)" }),
});
const alertingAuthorityStyle = new Style({
  fill: new Fill({ color: "rgba(100, 100, 100, 0.2)" }),
});

let hovered: Feature | null;
export default function Map({
  regions = {},
  onRegionsChange,
  alertingAuthority,
  enableInteraction = false,
}: Partial<FormAlertData> & {
  onRegionsChange: (regions: FormAlertData["regions"]) => void;
  alertingAuthority: AlertingAuthority | null;
  enableInteraction: boolean;
}) {
  useGeographic();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<OLMap | null>(null);
  const [selectedFeatures] = useState<OLFeatureCollection<Feature>>(
    new OLFeatureCollection()
  );
  const [selectedFeaturesSource] = useState<OLVectorSource>(
    new OLVectorSource({ wrapX: false, features: selectedFeatures })
  );
  const [select] = useState(
    new OLSelect({
      features: selectedFeatures,
      toggleCondition: singleClick,
      filter: (f) => f.getId() !== "alertingAuthority",
      style: selectedStyle,
    })
  );

  const defaultFeaturesSource = useMemo(
    () =>
      new OLVectorSource({
        url: `/geojson-regions?countryCode=${alertingAuthority?.countryCode}`,
        format: geojsonFormat,
      }),
    [alertingAuthority]
  );

  const metersPerUnit = map?.getView().getProjection().getMetersPerUnit();

  const alertingAuthorityPolygonCoordinates: any = [
    alertingAuthority?.polygon?.split(" ").map((c) =>
      c
        .split(",")
        .map((c) => +c)
        .reverse()
    ) ?? [],
  ];

  const alertingAuthorityRegion = new Feature({
    geometry: new Polygon(alertingAuthorityPolygonCoordinates),
  });
  alertingAuthorityRegion.setId("alertingAuthority");

  const updateRegionsOnMap = () => {
    selectedFeaturesSource.forEachFeature((f) => {
      const id = f.getId() as string;
      if (!regions[id]) selectedFeaturesSource.removeFeature(f);
    });

    Object.keys(regions).forEach((r) => {
      const feature = defaultFeaturesSource.getFeatureById(r);
      if (feature && selectedFeaturesSource.hasFeature(feature)) return;
      if (feature?.get("ADMIN") != null) {
        // Handle default country features
        selectedFeaturesSource.addFeature(feature);
      } else if (r.startsWith("custom-")) {
        // Handle custom features
        const data = regions[r]?.[0];
        if (!data) return;

        if (typeof data === "string") {
          if (!metersPerUnit) return;

          const [coords, radius] = data.split(" ");
          const circleFeature = new Feature(
            new Circle(
              coords
                .split(",")
                .map((c) => +c)
                .reverse(),
              (+radius * 1000) / metersPerUnit
            )
          );
          circleFeature.setId(r);
          selectedFeaturesSource.addFeature(circleFeature);
        } else {
          const polygonFeature = new Feature(new Polygon([data]));
          polygonFeature.setId(r);
          const geoJsonFeature =
            geojsonFormat.writeFeatureObject(polygonFeature);
          flip(geoJsonFeature, { mutate: true });
          selectedFeaturesSource.addFeature(
            geojsonFormat.readFeature(geoJsonFeature)
          );
        }
      }
    });
  };

  useMountEffect(() => {
    const mapObject = new OLMap({
      view: new OLView({
        extent: alertingAuthorityRegion.getGeometry()?.getExtent(),
        projection: "EPSG:4326",
        showFullExtent: true,
        center: [1, 1],
        zoom: 1,
      }),
      layers: [],
      overlays: [],
      interactions: OLDefaultInteractions().extend([select]),
    });

    if (mapRef.current) mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    alertingAuthorityRegion.setStyle(alertingAuthorityStyle);
    defaultFeaturesSource?.addFeature(alertingAuthorityRegion);
    defaultFeaturesSource.on("featuresloadend", updateRegionsOnMap);
    return () => {
      mapObject.removeInteraction(select);
      defaultFeaturesSource.un("featuresloadend", updateRegionsOnMap);
      mapObject.setTarget(undefined);
    };
  });

  useEffect(() => {
    if (!enableInteraction) {
      select.setActive(false);
      return;
    }

    select.setActive(true);

    const hoverListener = (e) => {
      if (hovered) {
        hovered.setStyle(undefined);
        hovered = null;
      }

      // If currently drawing (i.e., more than the defaul interactions + the select interaction), don't show hover highlight
      if (
        map?.getInteractions().getLength() !==
        OLDefaultInteractions().getLength() + 1
      ) {
        return;
      }

      map?.forEachFeatureAtPixel(e.pixel, (f) => {
        const feature = f as Feature;

        // Don't show hover colour over the user's entire AA
        if (feature.getId() === "alertingAuthority") return;

        // Don't show hover colour if feature already selected
        if (selectedFeaturesSource.hasFeature(feature)) return;

        // Don't show hover colour for features not inside user's AA
        if (
          !alertingAuthorityRegion
            .getGeometry()
            ?.containsXY(...map?.getCoordinateFromPixel(e.pixel))
        ) {
          return;
        }

        hovered = feature;
        feature.setStyle(hoverStyle);
        return true;
      });
    };

    map?.on("pointermove", hoverListener);
    return () => {
      map?.un("pointermove", hoverListener);
      hovered?.setStyle(undefined);
      select.setActive(false);
    };
  }, [map, enableInteraction]);

  useEffect(() => {
    const addFeatureHandler = (e: VectorSourceEvent<Geometry>) => {
      if (!e.feature) return;

      const id = e.feature.getId();
      if (id && regions[id]?.length) return;

      const regionName = e.feature?.get("ADMIN");
      if (regionName) {
        // A full country was selected

        const geoJsonFeature = geojsonFormat.writeFeatureObject(e.feature);
        flip(geoJsonFeature, { mutate: true });
        onRegionsChange({
          ...regions,
          [regionName]: geoJsonFeature.geometry.coordinates.flat(),
        });
      } else {
        // A custom polygon/circle was added

        const name = e.feature.get("name");
        if (!name) {
          selectedFeaturesSource.removeFeature(e.feature);
          return;
        }

        e.feature.setId(name);
        const geometryType = e.feature?.getGeometry()?.getType();

        if (geometryType === "Polygon") {
          const geoJsonFeature = geojsonFormat.writeFeatureObject(e.feature);
          flip(geoJsonFeature, { mutate: true });

          onRegionsChange({
            ...regions,
            [`custom-${name}`]: geoJsonFeature.geometry.coordinates,
          });
        } else {
          const geometry = e.feature.getGeometry() as Circle;
          // Center is in form Longitude, Latitude
          const center = geometry.getCenter();

          if (!metersPerUnit) return;
          const radiusKm = (geometry.getRadius() * metersPerUnit) / 1000;

          // CAP needs Center as Latitude, Longitude.
          // CAP needs radius in km after a space character
          onRegionsChange({
            ...regions,
            [`custom-${name}`]: [`${center.reverse().join(",")} ${radiusKm}`],
          });
        }
      }
    };

    const removeFeatureHandler = (e: VectorSourceEvent<Geometry>) => {
      const region = e.feature?.getId();
      if (region) {
        // A full country was deleted
        delete regions[region];
        onRegionsChange({ ...regions });
      }
    };

    selectedFeaturesSource.on("addfeature", addFeatureHandler);
    selectedFeaturesSource.on("removefeature", removeFeatureHandler);

    updateRegionsOnMap();

    return () => {
      selectedFeaturesSource.un("addfeature", addFeatureHandler);
      selectedFeaturesSource.un("removefeature", removeFeatureHandler);
    };
  }, [map, regions]);

  return (
    <div ref={mapRef} style={{ height: "400px", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <TileLayer map={map} source={OSMSource} zIndex={0} />
        <VectorLayer
          map={map}
          source={selectedFeaturesSource}
          style={selectedStyle}
          zIndex={10}
        />
        <VectorLayer
          map={map}
          source={defaultFeaturesSource}
          style={defaultFeatureCountryStyle}
          zIndex={2}
        />

        {enableInteraction &&
          ["Polygon", "Circle"].map((objectType, i) => (
            <IconButton
              key={`draw-btn-${objectType}`}
              appearance="primary"
              size="sm"
              color="violet"
              title={`Draw ${objectType}`}
              style={{ position: "absolute", zIndex: 4, right: 0, top: i * 50 }}
              icon={
                <Icon
                  as={objectType === "Polygon" ? PolygonImage : CircleImage}
                />
              }
              onClick={() => {
                const existingDrawInteractions = map
                  ?.getInteractions()
                  .getArray()
                  .filter((i) => i instanceof OLDraw);

                // i.e., user wants to toggle off a draw interaction
                if (existingDrawInteractions?.length) {
                  existingDrawInteractions?.forEach((i) =>
                    map?.removeInteraction(i)
                  );

                  return;
                }

                const draw = new OLDraw({
                  features: selectedFeatures,
                  type: objectType as Type,
                });
                draw.on("drawstart", () => select.setActive(false));
                draw.on("drawend", (e) => {
                  const name = window.prompt(
                    t`What is the name of this region?`
                  );
                  if (name) e.feature.setProperties({ name });
                  draw.setActive(false);
                  map?.removeInteraction(draw);
                  setTimeout(() => select.setActive(true), 300);
                });
                map?.addInteraction(draw);
              }}
            />
          ))}
      </div>
    </div>
  );
}
