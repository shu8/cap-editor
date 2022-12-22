import { EffectCallback, useEffect, useRef, useState } from "react";
import OLView from "ol/View";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import OLDraw from "ol/interaction/Draw";
import OLVectorSource from "ol/source/Vector";
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
import { FeatureLike } from "ol/Feature";

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

let hovered: FeatureLike | null = null;
export default function Map({
  onNewPolygon,
  enableInteraction = false,
}: {
  onNewPolygon: OnNewPolygonCallback;
  enableInteraction: boolean;
}) {
  useGeographic();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<OLMap | null>(null);
  const [polygonsSource, setPolygonsSource] = useState<OLVectorSource | null>(
    null
  );
  const [center, setCenter] = useState([1, 1]);

  useMountEffect(() => {
    const options = {
      view: new OLView({ center }),
      layers: [],
      controls: [],
      overlays: [],
    };
    const mapObject = new OLMap(options);
    if (mapRef.current) mapObject.setTarget(mapRef.current);
    mapObject.getView().setZoom(1);
    mapObject.getView().setCenter(center);

    setMap(mapObject);

    const source = new OLVectorSource({ wrapX: false });
    setPolygonsSource(source);

    return () => mapObject.setTarget(undefined);
  });

  useEffect(() => {
    if (!enableInteraction) return;

    const hoverListener = (e) => {
      if (hovered !== null) {
        hovered.setStyle(undefined);
        hovered = null;
      }

      map?.forEachFeatureAtPixel(e.pixel, function (f) {
        hovered = f;
        f.setStyle(hoverStyle);
        return true;
      });
    };

    const singleClickListener = (e) => {
      map?.forEachFeatureAtPixel(e.pixel, (f) => {
        if (polygonsSource?.hasFeature(f)) polygonsSource?.removeFeature(f);
        else polygonsSource?.addFeature(f);

        return true;
      });
    };

    map?.on("pointermove", hoverListener);
    map?.on("singleclick", singleClickListener);

    return () => {
      map?.un("pointermove", hoverListener);
      map?.un("singleclick", singleClickListener);
      hovered?.setStyle(undefined);
    };
  }, [map, enableInteraction]);

  useEffect(() => {
    map?.getView()?.setCenter(center);
  }, [map, center]);

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
              source: polygonsSource!,
              type: "Polygon",
            });
            map?.addInteraction(draw);

            draw.on("drawend", (e) => {
              const geometry = e.feature.getGeometry() as Polygon;
              draw.setActive(false);
              onNewPolygon("polygon", geometry.getCoordinates().flat());
              map?.removeInteraction(draw);
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
              source: polygonsSource!,
              type: "Circle",
            });
            map?.addInteraction(draw);

            draw.on("drawend", (e) => {
              const geometry = e.feature.getGeometry() as Circle;
              draw.setActive(false);
              onNewPolygon("circle", [
                ...geometry!.getCenter(),
                geometry!.getRadius(),
              ]);
              map?.removeInteraction(draw);
            });
          }}
        />
      </div>
    </div>
  );
}
