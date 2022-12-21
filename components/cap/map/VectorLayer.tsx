import OLVectorLayer from "ol/layer/Vector";
import { useEffect } from "react";

const VectorLayer = ({ map, source, style, zIndex = 0 }) => {
  useEffect(() => {
    if (!map) return;

    let layer = new OLVectorLayer({
      source,
      zIndex,
      style,
    });
    map.addLayer(layer);
    layer.setZIndex(zIndex);
    return () => {
      if (map) {
        map.removeLayer(layer);
      }
    };
  }, [map]);

  return null;
};

export default VectorLayer;
