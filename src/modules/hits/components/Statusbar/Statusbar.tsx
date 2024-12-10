import React from "react";
import { Button, Col, Spinner } from "react-bootstrap";
import { rtkQueryHookErrorToString } from "src/modules/common/utils/rtkQueryHookErrorToString";
import { useGetAllHitsQuery } from "../../hits.service";
import "./Statusbar.css";

const Statusbar: React.FC = () => {
  const { error, isLoading, refetch } = useGetAllHitsQuery();

  return (
    <Col xs={12} lg={12} className="statusbar">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => refetch()}
        disabled={isLoading}
      >
        Refetch
      </Button>
      <div className="vr mx-2"></div>
      <span className="me-1">Status:</span>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <span className="text-danger">{rtkQueryHookErrorToString(error)}</span>
      ) : (
        <span className="text-success">OK</span>
      )}
    </Col>
  );
};

export default Statusbar;
