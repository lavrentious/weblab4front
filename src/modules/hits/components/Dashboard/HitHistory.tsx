import React, { useCallback, useState } from "react";
import { Table } from "react-bootstrap";
import { Paginator } from "src/modules/common/components/Paginator";
import { Hit } from "../../hit.model";

interface HitHistoryProps {
  hits: Hit[];
}

const LIMIT = 20;

const HitHistory: React.FC<HitHistoryProps> = ({ hits }) => {
  const [page, setPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<keyof Hit | null>(null);
  const [sortDirection, setSortDirection] = useState<-1 | 1>(1);

  const sortedHits = useCallback(() => {
    if (!sortKey) return hits;
    return [...hits].sort((a, b) => {
      if (a[sortKey] > b[sortKey]) return sortDirection;
      if (a[sortKey] < b[sortKey]) return -sortDirection;
      return 0;
    });
  }, [hits, sortDirection, sortKey]);

  const HeaderCell: React.FC<{
    children: React.ReactNode;
    columnSortKey: keyof Hit;
  }> = ({ children, columnSortKey }) => {
    return (
      <th
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (sortKey === columnSortKey) {
            setSortDirection(sortDirection === 1 ? -1 : 1);
          } else {
            setSortKey(columnSortKey);
            setSortDirection(1);
          }
        }}
      >
        {children}
        {sortKey === columnSortKey && sortDirection === 1 && "▲"}
        {sortKey === columnSortKey && sortDirection === -1 && "▼"}
      </th>
    );
  };

  return (
    <>
      {hits.length > 0 && (
        <Paginator
          page={page}
          setPage={setPage}
          limit={LIMIT}
          totalPages={Math.ceil(hits.length / LIMIT)}
        />
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <HeaderCell columnSortKey="id">ID</HeaderCell>
            <HeaderCell columnSortKey="x">X</HeaderCell>
            <HeaderCell columnSortKey="y">Y</HeaderCell>
            <HeaderCell columnSortKey="r">R</HeaderCell>
            <HeaderCell columnSortKey="isHit">Hit</HeaderCell>
            <HeaderCell columnSortKey="createdAt">Created At</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {sortedHits()
            .slice((page - 1) * LIMIT, page * LIMIT)
            .map((hit) => (
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
              <td colSpan={6}>history empty</td>
            </tr>
          )}
        </tbody>
      </Table>
      {hits.length > 0 && (
        <Paginator
          page={page}
          setPage={setPage}
          limit={LIMIT}
          totalPages={Math.ceil(hits.length / LIMIT)}
        />
      )}
    </>
  );
};

export default HitHistory;
