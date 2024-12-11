import React, { useCallback, useRef } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { rtkQueryHookErrorToString } from "src/modules/common/utils/rtkQueryHookErrorToString";
import { RootState } from "src/store";
import "../components/Dashboard/Dashboard.css";
import DashboardForm from "../components/Dashboard/DashboardForm";
import HitHistory from "../components/Dashboard/HitHistory";
import Graph from "../components/Graph/Graph";
import Statusbar from "../components/Statusbar/Statusbar";
import {
  useCreateHitMutation,
  useDeleteAllHitsMutation,
  useGetAllHitsQuery,
} from "../hits.service";

const Dashboard = () => {
  const graphParent = useRef<HTMLDivElement>(null);

  const { data: hits } = useGetAllHitsQuery();
  const { r } = useSelector((state: RootState) => state.dashboard);
  const [createHit, { error: createHitError, isLoading: isCreating }] =
    useCreateHitMutation();
  const [deleteAllHits] = useDeleteAllHitsMutation();

  const createHitWithToast = useCallback(
    (x: number, y: number, r: number) => {
      toast.promise(
        createHit({
          x,
          y,
          r,
        }),
        {
          loading: "creating hit",
          success: "hit created",
          error: createHitError
            ? rtkQueryHookErrorToString(createHitError)
            : "error creating hit",
        },
      );
    },
    [createHit, createHitError],
  );

  return (
    <Container>
      <Row>
        <Statusbar />
      </Row>
      <Row className="mt-3">
        {/* Graph and Form Section */}
        <Col xs={12} lg={6} className="mb-4 d-flex flex-column">
          <div
            ref={graphParent}
            id="graph-container"
            className="mb-3 w-100 outlined"
            style={{ minHeight: 500 }}
          >
            <Graph
              hits={hits ? hits.filter((hit) => hit.r === r) : []}
              parentRef={graphParent}
              r={r}
              onClick={(x, y) => {
                if (!r) return;
                createHitWithToast(x, y, r);
              }}
              onClickNoR={() => toast.error("r is not specified")}
            />
          </div>
          <DashboardForm
            onHitSubmit={(x, y, r) => createHitWithToast(x, y, r)}
            isLoading={isCreating}
          />
        </Col>

        {/* History Section */}
        <Col xs={12} lg={6}>
          <h3>
            History
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              style={{ display: "inline-block" }}
              onClick={() => {
                if (window.confirm("clear history?")) {
                  deleteAllHits();
                }
              }}
            >
              clear
            </Button>
          </h3>
          {hits && <HitHistory hits={hits} />}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
