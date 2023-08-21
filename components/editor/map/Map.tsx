import { AlertingAuthority } from "@prisma/client";
import { Icon } from "@rsuite/icons";
import flip from "@turf/flip";
import truncate from "@turf/truncate";
import intersect from "@turf/intersect";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {  IconButton } from "rsuite";

import OLFeatureCollection from "ol/Collection";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import { Circle, Geometry, MultiPolygon, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { defaults as OLDefaultInteractions } from "ol/interaction";
import { defaults as defaultControls } from "ol/control.js";
import OLDraw from "ol/interaction/Draw";
import OLMap from "ol/Map";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import OLVectorSource, { VectorSourceEvent } from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import OLView from "ol/View";

import { useMountEffect } from "../../../lib/helpers.client";
import { FormAlertData } from "../EditorSinglePage";
import TileLayer from "./TileLayer";
import VectorLayer from "./VectorLayer";
import XYZ from "ol/source/XYZ";
import SplitButton from "../../SplitButton";

const COORDINATE_PRECISION = 3;

type BaseLayer = "OSM" | "ESRI";

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
const ESRISource = new XYZ({
  attributions:
    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
  url:
    "https://server.arcgisonline.com/ArcGIS/rest/services/" +
    "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
});
const selectedStyle = new Style({
  stroke: new Stroke({ color: "rgba(255, 0, 0, 0.2)" }),
  fill: new Fill({ color: "rgba(255, 0, 0, 0.2)" }),
});
const defaultFeatureCountryStyle = new Style({
  stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)" }),
  fill: new Fill({ color: "rgba(255, 255, 255, 0.1)" }),
});
const alertingAuthorityStyle = new Style({
  fill: new Fill({ color: "rgba(100, 100, 100, 0.2)" }),
});

export default function Map({
  regions = {},
  onRegionsChange,
  alertingAuthority,
  editingRegion,
}: Partial<FormAlertData> & {
  onRegionsChange: (regions: FormAlertData["regions"]) => void;
  alertingAuthority: AlertingAuthority | null;
  editingRegion: string;
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
  const [defaultFeaturesSource] = useState<OLVectorSource>(
    new OLVectorSource({ wrapX: false, features: [] })
  );
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("OSM");

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
    selectedFeaturesSource.forEachFeature((f) =>
      selectedFeaturesSource.removeFeature(f)
    );

    const handleRegion = (regionName: string) => {
      const data = regions[regionName];
      if (data.circles && metersPerUnit) {
        data.circles.forEach((circle) => {
          const [coords, radius] = circle.split(" ");
          const circleFeature = new Feature(
            new Circle(
              coords
                .split(",")
                .map((c) => +c)
                .reverse(),
              (+radius * 1000) / metersPerUnit
            )
          );
          selectedFeaturesSource.addFeature(circleFeature);
        });
      }

      data.polygons?.forEach((polygon) => {
        const polygonFeature = new Feature(new Polygon([polygon]));
        const geoJsonFeature = geojsonFormat.writeFeatureObject(polygonFeature);
        flip(geoJsonFeature, { mutate: true });
        selectedFeaturesSource.addFeature(
          geojsonFormat.readFeature(geoJsonFeature)
        );
      });
    };

    if (!editingRegion) Object.keys(regions).forEach((r) => handleRegion(r));
    else if (regions[editingRegion]) handleRegion(editingRegion);
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
      interactions: OLDefaultInteractions(),
      controls: defaultControls({ attributionOptions: { collapsible: true } }),
    });

    if (mapRef.current) mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    alertingAuthorityRegion.setStyle(alertingAuthorityStyle);
    defaultFeaturesSource?.addFeature(alertingAuthorityRegion);
    return () => {
      mapObject.setTarget(undefined);
    };
  });

  useEffect(() => {
    const addFeatureHandler = (e: VectorSourceEvent<Geometry>) => {
      if (!e.feature) return;

      if (e.feature.get("invalid")) {
        selectedFeaturesSource.removeFeature(e.feature);
        return;
      }

      if (!e.feature.get("drawn")) return;

      const geometryType = e.feature?.getGeometry()?.getType();
      if (geometryType === "Polygon") {
        const geoJsonFeature = geojsonFormat.writeFeatureObject(e.feature);
        flip(geoJsonFeature, { mutate: true });
        truncate(geoJsonFeature, {
          precision: COORDINATE_PRECISION,
          mutate: true,
        });

        if (!regions[editingRegion]) {
          regions[editingRegion] = {
            polygons: [],
            circles: [],
            geocodes: {},
          };
        }
        regions[editingRegion].polygons.push(
          geoJsonFeature.geometry.coordinates.flat()
        );
        onRegionsChange({ ...regions });
      } else {
        const geometry = e.feature.getGeometry() as Circle;
        // Center is in form Longitude, Latitude
        const center = geometry.getCenter();

        if (!metersPerUnit) return;
        const radiusKm = (geometry.getRadius() * metersPerUnit) / 1000;

        // CAP needs Center as Latitude, Longitude.
        // CAP needs radius in km after a space character
        if (!regions[editingRegion]) {
          regions[editingRegion] = {
            polygons: [],
            circles: [],
            geocodes: {},
          };
        }
        regions[editingRegion].circles.push(
          `${center
            .reverse()
            .map((n) => n.toFixed(COORDINATE_PRECISION))
            .join(",")} ${radiusKm.toFixed(COORDINATE_PRECISION)}`
        );
        onRegionsChange({ ...regions });
      }
    };

    selectedFeaturesSource.on("addfeature", addFeatureHandler);
    updateRegionsOnMap();
    return () => {
      selectedFeaturesSource.un("addfeature", addFeatureHandler);
    };
  }, [map, regions, editingRegion]);

  return (
    <div ref={mapRef} style={{ height: "400px", width: "45%" }}>
      <div style={{ position: "relative" }}>
        {baseLayer === "ESRI" && (
          <TileLayer map={map} source={ESRISource} zIndex={0} />
        )}
        {baseLayer === "OSM" && (
          <TileLayer map={map} source={OSMSource} zIndex={0} />
        )}
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

        <div style={{ position: "absolute", zIndex: 4, left: 35, top: 10 }}>
          <SplitButton
            color="violet"
            appearance="primary"
            options={["OSM", "ESRI"]}
            arrowDirection="down"
            size="xs"
            onClick={(i) => setBaseLayer(["OSM", "ESRI"][i] ?? "OSM")}
          />
        </div>

        {["Polygon", "Circle"].map((objectType, i) => (
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
              if (!editingRegion) {
                window.alert(
                  "Please choose/type an area name before drawing the area"
                );
              }

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

              draw.on("drawend", (e) => {
                // Prevent drawing intersecting polygons
                if (objectType === "Polygon") {
                  const features = selectedFeatures.getArray();
                  for (let i = 0; i < features.length; i++) {
                    if (
                      (features[i].getGeometry() instanceof Polygon ||
                        features[i].getGeometry() instanceof MultiPolygon) &&
                      intersect(
                        geojsonFormat.writeFeatureObject(features[i]),
                        geojsonFormat.writeFeatureObject(e.feature)
                      )
                    ) {
                      e.feature.setProperties({ invalid: true });
                      draw.setActive(false);
                      map?.removeInteraction(draw);
                      return;
                    }
                  }
                }

                e.feature.setProperties({ drawn: true });
                draw.setActive(false);
                map?.removeInteraction(draw);
              });
              map?.addInteraction(draw);
            }}
          />
        ))}
      </div>
    </div>
  );
}
