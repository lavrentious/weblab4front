import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function rtkQueryHookErrorToString(
  error: FetchBaseQueryError | SerializedError,
): string {
  if ("status" in error) {
    const err = error as { status: number | string; data?: unknown };
    return `Error ${err.status}: ${
      typeof err.data === "string"
        ? err.data
        : JSON.stringify(err.data, null, 2)
    }`;
  } else if ("message" in error) {
    return `Error: ${error.message}`;
  }
  return "unknown error";
}
