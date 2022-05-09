import { PointData } from "@/types/Models";
import { Coordinate } from "@/types";

export function getDistancePosition(
  firstCoordinate: Coordinate,
  secondCoordinate: Coordinate
): number {
  const R = 6371;

  const sinLat = Math.sin(
    ((firstCoordinate[1] - secondCoordinate[1]) * Math.PI) / 180 / 2
  );
  const sinLon = Math.sin(
    ((firstCoordinate[0] - secondCoordinate[0]) * Math.PI) / 180 / 2
  );

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        sinLat * sinLat +
          sinLon *
            sinLon *
            Math.cos((firstCoordinate[1] * Math.PI) / 180) *
            Math.cos((secondCoordinate[1] * Math.PI) / 180)
      )
    )
  );
}

function chackFakePointWrapper() {
  let APoint: PointData | null = null;

  return (BPoint: PointData | null, CPoint: PointData) => {
    let pointIsFake = false;

    if (APoint === null || BPoint === null) pointIsFake = false;
    else {
      const distanceAB: number = getDistancePosition(
        [APoint.lon, APoint.lat],
        [BPoint.lon, BPoint.lat]
      );
      const distanceBC: number = getDistancePosition(
        [BPoint.lon, BPoint.lat],
        [CPoint.lon, CPoint.lat]
      );
      const distanceAC: number = getDistancePosition(
        [APoint.lon, APoint.lat],
        [CPoint.lon, CPoint.lat]
      );

      if (distanceAB === 0) pointIsFake = true;
      if (distanceAB > distanceAC && distanceBC > distanceAC)
        pointIsFake = true;
    }

    APoint = BPoint;
    return pointIsFake;
  };
}

export const chackFakePoint = chackFakePointWrapper();
