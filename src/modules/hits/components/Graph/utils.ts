export enum GraphLabelPosition {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}
export type GraphLabel = {
  text: string;
  position: GraphLabelPosition;
};

export function convenientPosition(x: number, y: number): GraphLabelPosition {
  if (x > 0 && y > 0) {
    return GraphLabelPosition.TOP_RIGHT;
  } else if (x < 0 && y > 0) {
    return GraphLabelPosition.TOP_LEFT;
  } else if (x > 0 && y < 0) {
    return GraphLabelPosition.BOTTOM_RIGHT;
  } else if (x < 0 && y < 0) {
    return GraphLabelPosition.BOTTOM_LEFT;
  } else if (x === 0 && y > 0) {
    return GraphLabelPosition.TOP;
  } else if (x === 0 && y < 0) {
    return GraphLabelPosition.BOTTOM;
  } else if (x > 0 && y === 0) {
    return GraphLabelPosition.RIGHT;
  } else if (x < 0 && y === 0) {
    return GraphLabelPosition.LEFT;
  }
  return GraphLabelPosition.TOP_RIGHT;
}

export function labelPositionToOffset(
  position: GraphLabelPosition,
  offset: number,
): {
  xOffset: number;
  yOffset: number;
} {
  switch (position) {
    case GraphLabelPosition.LEFT:
      return { xOffset: -offset, yOffset: 0 };
    case GraphLabelPosition.RIGHT:
      return { xOffset: offset, yOffset: 0 };
    case GraphLabelPosition.TOP:
      return { xOffset: 0, yOffset: -offset };
    case GraphLabelPosition.BOTTOM:
      return { xOffset: 0, yOffset: offset };
    case GraphLabelPosition.TOP_LEFT:
      return { xOffset: -offset, yOffset: -offset };
    case GraphLabelPosition.TOP_RIGHT:
      return { xOffset: offset, yOffset: -offset };
    case GraphLabelPosition.BOTTOM_LEFT:
      return { xOffset: -offset, yOffset: offset };
    case GraphLabelPosition.BOTTOM_RIGHT:
      return { xOffset: offset, yOffset: offset };
  }
}
