import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Paginator } from "src/modules/common/components/Paginator";
import { Hit } from "../../hit.model";

interface HitHistoryProps {
  hits: Hit[];
}

const LIMIT = 20;

const HitHistory: React.FC<HitHistoryProps> = ({ hits }) => {
  const [page, setPage] = useState<number>(1);
  return (
    <>
      <Paginator
        page={page}
        setPage={setPage}
        limit={LIMIT}
        totalPages={Math.ceil(hits.length / LIMIT)}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>X</th>
            <th>Y</th>
            <th>R</th>
            <th>Hit</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {hits.slice((page - 1) * LIMIT, page * LIMIT).map((hit) => (
            <tr key={hit.id}>
              <td>{hit.id}</td>
              <td>{hit.x.toFixed(2)}</td>
              <td>{hit.y.toFixed(2)}</td>
              <td>{hit.r.toFixed(2)}</td>
              <td>{hit.isHit ? "✅" : "❌"}</td>
              <td>{new Date(hit.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {hits.length === 0 && (
            <tr className="text-center">
              <td colSpan={6}>HitHistory empty</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Paginator
        page={page}
        setPage={setPage}
        limit={LIMIT}
        totalPages={Math.ceil(hits.length / LIMIT)}
      />
    </>
  );
};

export default HitHistory;
