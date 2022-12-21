import { EffectCallback, useEffect, useRef, useState } from "react";
import OLView from "ol/View";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import OLDraw from "ol/interaction/Draw";
import OLVectorSource from "ol/source/Vector";
import { Button, IconButton } from "rsuite";
import { Icon } from "@rsuite/icons";
import { useGeographic } from "ol/proj";
import TileLayer from "./TileLayer";
import VectorLayer from "./VectorLayer";
import { Circle, Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import Image from "next/image";
import { Style, Stroke, Fill } from "ol/style";

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

export default function Map({
  onNewPolygon,
}: {
  onNewPolygon: OnNewPolygonCallback;
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
    map?.getView()?.setCenter(center);
  }, [map, center]);

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <TileLayer map={map} source={new OSM()} zIndex={0} />
        <VectorLayer
          map={map}
          source={polygonsSource}
          style={
            new Style({
              stroke: new Stroke({ color: "rgba(255, 0, 0, 0.2)" }),
              fill: new Fill({ color: "rgba(255, 0, 0, 0.2)" }),
            })
          }
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
            });
          }}
        />
      </div>
    </div>
  );
}

/**london
 * {
  "disposed": false,
  "pendingRemovals_": {},
  "dispatching_": {},
  "listeners_": {
    "change": [
      null
    ]
  },
  "revision_": 141,
  "ol_uid": "2503",
  "values_": null,
  "extent_": [
    -361.22051649343524,
    51.17740217725998,
    -359.13898729082285,
    52.06859466061769
  ],
  "extentRevision_": 141,
  "simplifiedGeometryMaxMinSquaredTolerance": 0,
  "simplifiedGeometryRevision": 0,
  "layout": "XY",
  "stride": 2,
  "flatCoordinates": [
    -361.22051649343524,
    51.9470921497375,
    -361.130795931126,
    51.17740217725998,
    -359.13898729082285,
    51.30098060938579,
    -359.35431795463944,
    52.06859466061769,
    -361.22051649343524,
    51.9470921497375
  ],
  "ends_": [
    10
  ],
  "flatInteriorPointRevision_": -1,
  "flatInteriorPoint_": null,
  "maxDelta_": -1,
  "maxDeltaRevision_": -1,
  "orientedRevision_": -1,
  "orientedFlatCoordinates_": null
}
 */
