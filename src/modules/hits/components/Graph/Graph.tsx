import {
  Container as PixiContainer,
  Graphics as GraphicsComponent,
  Stage,
  Text,
} from "@pixi/react";
import { ColorSource, Graphics, ICanvas, TextStyle } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Hit } from "../../hit.model";
import { convenientPosition, labelPositionToOffset } from "./utils";

const R_PX_MODIFIER = 3;
const GRID_LINES_MULTIPLIER = 0.8;
const R_MARK_LEN_PX = 20;
const FONT_SIZE = 16;
const FONT_SIZE_SM = 10;
enum PointColor {
  SHAPE = 0x80bfff,
  GRAPH = 0x000000,
  HIT = 0x00ff00,
  MISS = 0xff0000,
  PREVIEW = 0xff66cc,
  OLD_HIT = 0x00aa00,
  OLD_MISS = 0xaa0000,
}

export interface IPoint {
  id: number;
  x: number; // in units
  y: number; // in units
  r: number; // in units
  color: ColorSource; // FIXME
}

interface GraphProps {
  hits: Hit[];
  r: number | null; // in units
  parentRef: React.RefObject<HTMLDivElement>;
  onClick?: (x: number, y: number) => void; // in units
  onClickNoR?: () => void;
}

const Graph: React.FC<GraphProps> = React.memo(
  ({ hits, parentRef, r, onClick, onClickNoR }) => {
    // --- dynamic resizing ---
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0]) return;
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      });
      if (parentRef.current) {
        resizeObserver.observe(parentRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [parentRef]);

    const canvasWidth = dimensions.width;
    const canvasHeight = dimensions.height;

    const canvasRef = React.useRef<ICanvas | null>(null);

    // --- utils ---
    const initializationTimestamp = useRef(new Date());
    const pseudoR = useMemo(() => {
      return r === null ? 1 : r;
    }, [r]);
    const unitsToPx = useCallback(
      (units: number): number => {
        const pxPerUnit =
          Math.min(canvasWidth, canvasHeight) / (R_PX_MODIFIER * pseudoR);
        return units * pxPerUnit;
      },
      [canvasWidth, canvasHeight, pseudoR],
    );
    const unitsPointToPxPoint = useCallback(
      (point: { x: number; y: number }): { x: number; y: number } => {
        return {
          x: unitsToPx(point.x),
          y: -unitsToPx(point.y),
        };
      },
      [unitsToPx],
    );

    const pxToUnits = useCallback(
      (px: number): number => {
        const pxPerUnit =
          Math.min(canvasWidth, canvasHeight) / (R_PX_MODIFIER * pseudoR);
        return px / pxPerUnit;
      },
      [canvasWidth, canvasHeight, pseudoR],
    );
    const pxPointToUnitsPoint = useCallback(
      (point: { x: number; y: number }): { x: number; y: number } => {
        return {
          x: pxToUnits(point.x),
          y: -pxToUnits(point.y),
        };
      },
      [pxToUnits],
    );

    const pseudoRPx = useMemo(() => unitsToPx(pseudoR), [pseudoR, unitsToPx]);

    const clientPointToPxPoint = useCallback(
      (point: { x: number; y: number }): { x: number; y: number } => {
        if (!canvasRef.current?.getBoundingClientRect) return { x: 0, y: 0 };
        const x =
          point.x -
          canvasRef.current.getBoundingClientRect().x -
          canvasWidth / 2;
        const y =
          point.y -
          canvasRef.current.getBoundingClientRect().y -
          canvasHeight / 2;
        return { x, y };
      },
      [canvasWidth, canvasHeight],
    );

    // --- data ---
    const points: IPoint[] = hits.map(
      (hit) =>
        ({
          id: hit.id,
          x: hit.x,
          y: hit.y,
          r: hit.r,
          color:
            new Date(hit.createdAt) > initializationTimestamp.current
              ? hit.isHit
                ? PointColor.HIT
                : PointColor.MISS
              : hit.isHit
                ? PointColor.OLD_HIT
                : PointColor.OLD_MISS,
        }) as IPoint,
    );
    const rMarks: {
      r: number;
      label: string;
    }[] = useMemo(() => {
      const rs = [-pseudoR, -pseudoR / 2, pseudoR / 2, pseudoR];
      const labels =
        r === null ? ["-R", "-R/2", "R/2", "R"] : rs.map((r) => r.toString());
      return rs.map((r, i) => ({ r, label: labels[i] ?? r.toString() }));
    }, [r, pseudoR]);

    const onClickWrapper = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onClick || !canvasRef.current?.getBoundingClientRect) return;
      if (!r && onClickNoR) return onClickNoR();

      const { x: xPx, y: yPx } = clientPointToPxPoint({
        x: e.clientX,
        y: e.clientY,
      });

      const { x, y } = pxPointToUnitsPoint({ x: xPx, y: yPx });

      onClick(x, y);
    };

    // --- drawing ---
    const Point: React.FC<{ point: IPoint }> = (props: { point: IPoint }) => {
      const draw = useCallback(
        (g: Graphics) => {
          g.clear();
          g.beginFill(props.point.color);
          g.drawCircle(0, 0, 3);
          g.endFill();
        },
        [props.point],
      );

      return (
        <GraphicsComponent
          x={unitsPointToPxPoint(props.point).x}
          y={unitsPointToPxPoint(props.point).y}
          draw={draw}
        />
      );
    };

    const drawGrid = useCallback(
      (g: Graphics) => {
        g.clear();
        g.lineStyle({ color: PointColor.GRAPH, width: 2, alignment: 0 });
        g.moveTo((-canvasWidth / 2) * GRID_LINES_MULTIPLIER, 0);
        g.lineTo((canvasWidth / 2) * GRID_LINES_MULTIPLIER, 0);
        g.moveTo(0, (-canvasHeight / 2) * GRID_LINES_MULTIPLIER);
        g.lineTo(0, (canvasHeight / 2) * GRID_LINES_MULTIPLIER);
        g.endFill();
      },
      [canvasWidth, canvasHeight],
    );

    const drawShape = useCallback(
      (g: Graphics) => {
        g.clear();
        g.beginFill(PointColor.SHAPE, 0.5);
        // quarter circle
        g.arc(0, 0, pseudoRPx / 2, -Math.PI / 2, 0);
        g.moveTo(0, -pseudoRPx / 2);
        g.lineTo(pseudoRPx / 2, 0);
        g.lineTo(0, 0);

        //rectangle
        g.lineTo(pseudoRPx, 0);
        g.lineTo(pseudoRPx, pseudoRPx / 2);
        g.lineTo(0, pseudoRPx / 2);

        // triangle
        g.moveTo(0, pseudoRPx);
        g.lineTo(-pseudoRPx, 0);
        g.lineTo(0, 0);

        g.endFill();
      },
      [pseudoRPx],
    );

    const GraphGridRMark: React.FC<{
      xUnits: number;
      yUnits: number;
      direction: "horizontal" | "vertical";
      label: string;
    }> = ({ xUnits, yUnits, direction, label }) => {
      const { x: xPx, y: yPx } = unitsPointToPxPoint({ x: xUnits, y: yUnits });
      const textX =
        direction === "vertical" ? xPx : xPx + R_MARK_LEN_PX + FONT_SIZE / 2;
      const textY =
        direction === "horizontal" ? yPx : yPx - R_MARK_LEN_PX - FONT_SIZE / 2;
      const drawLine = useCallback(
        (g: Graphics) => {
          g.clear();
          g.lineStyle({ color: PointColor.GRAPH, width: 2, alignment: 0 });
          if (direction === "horizontal") {
            g.moveTo(xPx - R_MARK_LEN_PX / 2, yPx);
            g.lineTo(xPx + R_MARK_LEN_PX / 2, yPx);
          } else if (direction === "vertical") {
            g.moveTo(xPx, yPx - R_MARK_LEN_PX / 2);
            g.lineTo(xPx, yPx + R_MARK_LEN_PX / 2);
          }
        },
        [xPx, yPx, direction],
      );

      return (
        <>
          <GraphicsComponent draw={drawLine} />
          <Text
            text={label}
            x={textX}
            y={textY}
            anchor={[0.5, 0.5]}
            style={
              new TextStyle({
                fontSize: FONT_SIZE,
                fontFamily: "monospace",
                fill: PointColor.GRAPH,
              })
            }
          />
        </>
      );
    };

    // --- drag ---
    const [draggedPointPx, setDraggedPointPx] = useState<{
      x: number;
      y: number;
    } | null>(null);

    const startDrag = useCallback(
      (e: React.MouseEvent) => {
        if (draggedPointPx || !canvasRef.current || !r) return;
        setDraggedPointPx(clientPointToPxPoint({ x: e.clientX, y: e.clientY }));
      },
      [draggedPointPx, r, clientPointToPxPoint],
    );

    const drag = useCallback(
      (e: React.MouseEvent) => {
        if (!draggedPointPx) return;
        setDraggedPointPx(clientPointToPxPoint({ x: e.clientX, y: e.clientY }));
      },
      [draggedPointPx, clientPointToPxPoint],
    );

    const cancelDrag = useCallback(() => {
      if (!draggedPointPx) return;
      setDraggedPointPx(null);
    }, [draggedPointPx]);

    const endDrag = useCallback(() => {
      if (!draggedPointPx) return;
      setDraggedPointPx(null);
    }, [draggedPointPx]);

    const drawPreviewPoint = useCallback((g: Graphics) => {
      g.clear();
      g.beginFill(PointColor.PREVIEW, 0.5);
      g.drawCircle(0, 0, 3);
      g.endFill();
    }, []);

    // --- render ---
    console.log("rendering", canvasWidth, canvasHeight);

    return (
      <Stage
        options={{
          background: 0xffffff,
        }}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          display: "block",
          width: canvasWidth,
          height: canvasHeight,
        }}
        onClick={onClickWrapper}
        onMouseDown={startDrag}
        onMouseMove={drag}
        onMouseLeave={cancelDrag}
        onMouseUp={endDrag}
        onMount={(app) => {
          canvasRef.current = app.view;
        }}
      >
        <PixiContainer x={canvasWidth / 2} y={canvasHeight / 2}>
          {/* translated container */}
          {/* (0,0) = center */}
          <GraphicsComponent draw={drawShape} />
          <GraphicsComponent draw={drawGrid} />

          {rMarks.map(({ r, label }) => (
            <React.Fragment key={`rlabel${r}`}>
              <GraphGridRMark
                xUnits={r}
                yUnits={0}
                direction="vertical"
                label={label}
                key={`rlabel${r}v`}
              />
              <GraphGridRMark
                xUnits={0}
                yUnits={r}
                direction="horizontal"
                label={label}
                key={`rlabel${r}h`}
              />
            </React.Fragment>
          ))}

          {points.map((point) => (
            <Point key={point.id} point={point} />
          ))}

          {/* preview point */}
          {draggedPointPx && (
            <GraphicsComponent
              x={draggedPointPx.x}
              y={draggedPointPx.y}
              draw={drawPreviewPoint}
            />
          )}
          {draggedPointPx && (
            <Text
              text="preview"
              x={
                draggedPointPx.x +
                labelPositionToOffset(
                  convenientPosition(draggedPointPx.x, -draggedPointPx.y),
                  FONT_SIZE_SM,
                ).xOffset
              }
              y={
                draggedPointPx.y +
                labelPositionToOffset(
                  convenientPosition(draggedPointPx.x, -draggedPointPx.y),
                  FONT_SIZE_SM,
                ).yOffset
              }
              anchor={0.5}
              style={
                new TextStyle({
                  fontSize: FONT_SIZE_SM,
                  fontFamily: "monospace",
                  fill: PointColor.PREVIEW,
                })
              }
            />
          )}
        </PixiContainer>
      </Stage>
    );
  },
);

export default Graph;
