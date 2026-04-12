import type { Position } from "@/interface/utils.interface";
import {
  type MapCameraChangedEvent,
  type MapCameraProps,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface UseMapsProps {
  position?: Position;
  disableInit?: boolean;
}

export function useMaps(props?: UseMapsProps) {
  const [position, setPosistion] = useState<Position>(
    props?.position || {
      lat: -12.051631251341286,
      lng: -77.03434007801428,
    },
  );

  const [camaraProps, setCameraProps] = useState<MapCameraProps>({
    center: position,
    zoom: 15,
  });
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
  }, []);

  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    requestOptions: { region: "PE" },
    initOnMount: false,
  });
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !map) return;
    init();
  }, [placesLib, map]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setCameraProps({ center: { lat, lng }, zoom: 15 });
    setPosistion({ lat, lng });
  };

  const dataSearch = useMemo(() => {
    return status === "OK"
      ? data.map(({ description }) => {
          return { label: description, value: description };
        })
      : [{ label: "No hay resultados", value: "No hay resultados" }];
  }, [data]);

  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosistion({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      setCameraProps({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: 15,
      });
    });
  };

  useEffect(() => {
    if (props?.disableInit) return;

    setLocation();
  }, []);

  return {
    position,
    camaraProps,
    value,
    setValue,
    dataSearch,
    handleSelect,
    setLocation,
    setPosistion,
    handleCameraChange,
  };
}
