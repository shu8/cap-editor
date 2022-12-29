import OLTileLayer from "ol/layer/Tile";
import { useEffect } from "react";

const TileLayer = ({ map, source, zIndex = 0 }) => {
  useEffect(() => {
    if (!map) return;

    let tileLayer = new OLTileLayer({ source, zIndex });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);

    return () => {
      map?.removeLayer(tileLayer);
    };
  }, [map]);

  return null;
};

export default TileLayer;
