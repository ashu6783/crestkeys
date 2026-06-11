import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseCoordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function hasValidCoordinates(
  latitude: unknown,
  longitude: unknown
): latitude is number {
  return parseCoordinate(latitude) !== null && parseCoordinate(longitude) !== null;
}
