import { EffectCallback, useEffect, useRef, useState } from "react";
import OLView from "ol/View";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import OLDraw from "ol/interaction/Draw";
import OLSelect from "ol/interaction/Select";
import OLVectorSource from "ol/source/Vector";
import OLFeatureCollection from "ol/Collection";
import { IconButton } from "rsuite";
import { Icon } from "@rsuite/icons";
import { useGeographic } from "ol/proj";
import TileLayer from "./TileLayer";
import VectorLayer from "./VectorLayer";
import { Circle, Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import Image from "next/image";
import { Style, Stroke, Fill } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { AlertingAuthority } from "../../../lib/types";
import { singleClick } from "ol/events/condition";

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

type OnNewPolygonCallback = (
  type: "circle" | "polygon",
  coordinates: number[] | Coordinate[]
) => null;

const countriesSource = new OLVectorSource({
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
const defaultCountryStyle = new Style({
  stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)" }),
  fill: new Fill({ color: "rgba(255, 255, 255, 0.1)" }),
});
const alertingAuthorityStyle = new Style({
  fill: new Fill({ color: "rgba(100, 100, 100, 0.2)" }),
});

let hovered: Feature | null;
export default function Map({
  onNewPolygon,
  alertingAuthority,
  enableInteraction = false,
}: {
  onNewPolygon: OnNewPolygonCallback;
  alertingAuthority: AlertingAuthority;
  enableInteraction: boolean;
}) {
  useGeographic();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<OLMap | null>(null);
  const [selectedFeatures] = useState<OLFeatureCollection<Feature>>(
    new OLFeatureCollection()
  );
  const [polygonsSource] = useState<OLVectorSource>(
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
        zoom: 1,
        extent: alertingAuthorityRegion.getGeometry()?.getExtent(),
        showFullExtent: true,
        center: [1, 1],
      }),
      layers: [],
      controls: [],
      overlays: [],
      interactions: [select],
    });

    if (mapRef.current) mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    alertingAuthorityRegion.setStyle(alertingAuthorityStyle);
    countriesSource?.addFeature(alertingAuthorityRegion);
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
      if (map?.getInteractions().getLength() !== 10) return;

      map?.forEachFeatureAtPixel(e.pixel, (f) => {
        const feature = f as Feature;

        // Don't show hover colour over the user's entire AA
        if (feature.getId() === "alertingAuthority") return;

        // Don't show hover colour if feature already selected
        if (polygonsSource.hasFeature(feature)) return;

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

  return (
    <div ref={mapRef} style={{ height: "400px", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <TileLayer map={map} source={OSMSource} zIndex={0} />
        <VectorLayer
          map={map}
          source={polygonsSource}
          style={selectedStyle}
          zIndex={10}
        />
        <VectorLayer
          map={map}
          source={countriesSource}
          style={defaultCountryStyle}
          zIndex={2}
        />

        <IconButton
          appearance="ghost"
          size="sm"
          style={{ position: "absolute", zIndex: 4, right: 0, top: 0 }}
          icon={<Icon as={PolygonImage} />}
          onClick={() => {
            const draw = new OLDraw({
              features: selectedFeatures,
              type: "Polygon",
            });
            draw.on("drawstart", () => select.setActive(false));
            map?.addInteraction(draw);

            draw.on("drawend", (e) => {
              const geometry = e.feature.getGeometry() as Polygon;
              draw.setActive(false);
              onNewPolygon("polygon", geometry.getCoordinates().flat());
              map?.removeInteraction(draw);

              setTimeout(function () {
                select.setActive(true);
              }, 300);
            });
          }}
        />

        <IconButton
          appearance="ghost"
          size="sm"
          style={{ position: "absolute", zIndex: 4, right: 0, top: 50 }}
          icon={<Icon as={CircleImage} />}
          onClick={() => {
            const draw = new OLDraw({
              features: selectedFeatures,
              type: "Circle",
            });
            draw.on("drawstart", () => select.setActive(false));
            map?.addInteraction(draw);

            draw.on("drawend", (e) => {
              const geometry = e.feature.getGeometry() as Circle;
              draw.setActive(false);
              onNewPolygon("circle", [
                ...geometry!.getCenter(),
                geometry!.getRadius(),
              ]);

              setTimeout(function () {
                select.setActive(true);
              }, 300);
              map?.removeInteraction(draw);
            });
          }}
        />
      </div>
    </div>
  );
}
