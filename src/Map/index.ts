import { Coordinate } from "@/types";
import { getDistancePosition } from "@/utils";
import { Feature, LineString } from "geojson";
import mapboxgl, {
  EventData,
  GeoJSONSource,
  MapEventType,
  Marker,
} from "mapbox-gl";
import { Map } from "mapbox-gl";
import keys from "@/keys";

class MyMap {
  map: Map;
  marker: Marker;
  markerPosition: Coordinate = [0, 0];

  markerStyle = `
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    background-color: rgb(0, 0, 241);
  `;

  token = keys.accessTokenMapBox;

  constructor(id: string) {
    mapboxgl.accessToken = this.token;

    this.map = new mapboxgl.Map({
      container: id,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [37.610225, 55.651365],
      zoom: 13,
    });

    const el = document.createElement("div");
    el.style.cssText = this.markerStyle;

    this.marker = new mapboxgl.Marker(el).setLngLat([0, 0]).addTo(this.map);
  }

  onLoad(callback: (ev: MapEventType & EventData) => void) {
    this.map.on("load", callback);
  }

  resize() {
    this.map.resize();
  }

  createLine(name: string, color: string, opacity: number, width: number) {
    this.map.addSource(name, {
      type: "geojson",
      data: MyMap.getGeoJSON(),
    });

    this.map.addLayer({
      id: name,
      type: "line",
      source: name,
      paint: {
        "line-color": color,
        "line-opacity": opacity,
        "line-width": 8,
      },
    });
  }

  setCoordinatesToLine(id: string, coordinates: Coordinate[]) {
    (this.map.getSource(id) as GeoJSONSource).setData(
      MyMap.getGeoJSON(coordinates)
    );
  }

  setCoordinateToMarker(position: Coordinate) {
    this.markerPosition = position;
    this.marker.setLngLat(position);
  }

  moveToPointWithPlume(
    idPlume: string,
    plumeCoordinates: Coordinate[],
    newPosition: Coordinate,
    speed: number,
    callback: any
  ) {
    let distance = getDistancePosition(this.markerPosition, newPosition);
    if (distance === 0) distance = 0.001;

    const lastPlumeCoordinates: Coordinate[] = plumeCoordinates.slice(
      0,
      plumeCoordinates.length - 2
    );

    const deltaTime = (distance / speed) * 3.6e6;
    const deltaLon = newPosition[0] - this.markerPosition[0];
    const deltaLat = newPosition[1] - this.markerPosition[1];

    let start = true;
    let myTimeTemp = 0;
    let animateId: number;

    const animate = (timestamp: any) => {
      if (start) {
        start = false;
        myTimeTemp = timestamp;
      }
      const deltaTimetemp = timestamp - myTimeTemp;
      const newCoordinate: Coordinate = [
        this.markerPosition[0] + deltaLon * (deltaTimetemp / deltaTime),
        this.markerPosition[1] + deltaLat * (deltaTimetemp / deltaTime),
      ];

      this.marker.setLngLat(newCoordinate);
      this.setCoordinatesToLine(idPlume, [
        ...lastPlumeCoordinates,
        newCoordinate,
      ]);
      this.map.panTo(newCoordinate);

      if (deltaTime > deltaTimetemp) {
        animateId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animateId);
        this.setCoordinateToMarker(newPosition);
        this.setCoordinatesToLine(idPlume, plumeCoordinates);
        this.map.panTo(newPosition);
        callback(animateId);
      }
    };

    return requestAnimationFrame(animate);
  }

  static getGeoJSON(coordinates: Coordinate[] = []): Feature<LineString> {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }
}

export default MyMap;
