"use client";

/**
 * Patches CanvasRenderingContext2D.arc to clamp negative radii to 0.
 * Prevents runtime crashes from canvas components rendering before
 * their container has a positive size (e.g. during SSR hydration).
 */
if (typeof window !== "undefined" && typeof CanvasRenderingContext2D !== "undefined") {
  const _arc = CanvasRenderingContext2D.prototype.arc;
  CanvasRenderingContext2D.prototype.arc = function (
    x: number, y: number, radius: number,
    startAngle: number, endAngle: number, counterclockwise?: boolean,
  ) {
    return _arc.call(this, x, y, Math.max(0, radius), startAngle, endAngle, counterclockwise);
  };
}

export function CanvasSafeArc() {
  return null;
}
