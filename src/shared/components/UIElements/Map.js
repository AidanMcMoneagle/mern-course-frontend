import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  //We use useRef to point to the specfic DOM node where we want to render the map.
  const mapRef = useRef();

  const { center, zoom } = props;
  console.log(center, zoom);

  //Need to use useEffect as will run once the component has been rendered (JSX)
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
