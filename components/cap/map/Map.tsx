import { EffectCallback, useEffect, useRef, useState } from "react";
import OLView from "ol/View";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import OLDraw from "ol/interaction/Draw";
import OLSelect from "ol/interaction/Select";
import OLVectorSource, { VectorSourceEvent } from "ol/source/Vector";
import OLFeatureCollection from "ol/Collection";
import { IconButton } from "rsuite";
import { Icon } from "@rsuite/icons";
import { useGeographic } from "ol/proj";
import TileLayer from "./TileLayer";
import VectorLayer from "./VectorLayer";
import { Circle, Geometry, LineString, Point, Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import Image from "next/image";
import { Style, Stroke, Fill } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { AlertingAuthority } from "../../../lib/types/types";
import { singleClick } from "ol/events/condition";
import { AlertData } from "../NewAlert";
import { Type } from "ol/geom/Geometry";
import { defaults as OLDefaultInteractions } from "ol/interaction";
import { METERS_PER_UNIT } from "ol/proj";

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

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fn: EffectCallback) => useEffect(fn, []);

const defaultFeaturesSource = new OLVectorSource({
  url: "/countries.geojson",
  format: new GeoJSON(),
});
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
}: Partial<AlertData> & {
  onRegionsChange: (regions: AlertData["regions"]) => null;
  alertingAuthority: AlertingAuthority;
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

  const alertingAuthorityPolygonCoordinates: any = [
    alertingAuthority.polygon?.split(" ").map((c) =>
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
      controls: [],
      overlays: [],
      interactions: OLDefaultInteractions().extend([select]),
    });

    if (mapRef.current) mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    alertingAuthorityRegion.setStyle(alertingAuthorityStyle);
    defaultFeaturesSource?.addFeature(alertingAuthorityRegion);
    return () => {
      mapObject.removeInteraction(select);
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

      // If currently drawing (i.e., more interactions than usual), don't show hover highlight
      if (
        map?.getInteractions().getLength() !==
        OLDefaultInteractions().getLength()
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
        // TODO also do this for selection
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
      const region = e.feature?.get("ADMIN");

      if (region) {
        // A full country was selected

        onRegionsChange({
          ...regions,
          [region]: (e.feature?.getGeometry() as Polygon)
            ?.getCoordinates()
            ?.flat(),
        });
      } else {
        // A custom polygon/circle was added

        const id = `custom-${new Date().getTime()}`;
        e.feature?.setId(id);
        const geometryType = e.feature?.getGeometry()?.getType();

        if (geometryType === "Polygon") {
          onRegionsChange({
            ...regions,
            [id]: (e.feature?.getGeometry() as Polygon)
              ?.getCoordinates()
              ?.flat(),
          });
        } else {
          const geometry = e.feature?.getGeometry() as Circle;
          // Center is in form Longitude, Latitude
          const center = geometry.getCenter();
          const metersPerUnit = map
            ?.getView()
            .getProjection()
            .getMetersPerUnit();

          if (!metersPerUnit) return;
          const radiusKm = (geometry.getRadius() * metersPerUnit) / 1000;

          // WGS84 needs Center as Latitude, Longitude.
          // CAP wants radius in km after a space character
          onRegionsChange({
            ...regions,
            [id]: `${center.reverse().join(",")} ${radiusKm}`,
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

    selectedFeaturesSource.forEachFeature((f) => {
      const id = f.getId() as string;
      if (!regions[id]) selectedFeaturesSource.removeFeature(f);
    });

    Object.keys(regions).forEach((r) => {
      const feature = defaultFeaturesSource.getFeatureById(r);

      // Only handle default country features -- custom features are added immediately after drawing
      if (
        feature?.get("ADMIN") != null &&
        !selectedFeaturesSource.hasFeature(feature)
      ) {
        selectedFeaturesSource.addFeature(feature);
      }
    });

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
          ["Polygon", "Circle"].map((t, i) => (
            <IconButton
              key={`draw-btn-${t}`}
              appearance="primary"
              size="sm"
              color="orange"
              title={`Draw ${t}`}
              style={{ position: "absolute", zIndex: 4, right: 0, top: i * 50 }}
              icon={<Icon as={t === "Polygon" ? PolygonImage : CircleImage} />}
              onClick={() => {
                const draw = new OLDraw({
                  features: selectedFeatures,
                  type: t as Type,
                });
                draw.on("drawstart", () => select.setActive(false));
                draw.on("drawend", (e) => {
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
