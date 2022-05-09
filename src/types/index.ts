export type Coordinate = [number, number];
export type TMapState<T> = Partial<Record<keyof T, (state: T) => T[keyof T]>>;
