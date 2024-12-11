import React, { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

interface PaginatorProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  totalPages: number;
}

export function Paginator({ page, totalPages, setPage }: PaginatorProps) {
  const [activeEllipsis, setActiveEllipsis] = useState<number | null>(null);
  const [inputPage, setInputPage] = useState("");

  useEffect(() => {
    if (totalPages < page) setPage(totalPages);
  }, [totalPages, page, setPage]);

  const handleEllipsisClick = (direction: number) => {
    setActiveEllipsis(direction);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputPage("");
      setActiveEllipsis(null);
    }
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setPage(pageNum);
      }
      setInputPage("");
      setActiveEllipsis(null);
    }
  };

  const renderPageItems = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;
    const range = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i + 1);
      }
    } else {
      if (page > range + 1) pageNumbers.push(1);
      if (page > range + 2) {
        pageNumbers.push("leftEllipsis");
      }

      for (
        let i = Math.max(1, page - range);
        i <= Math.min(page + range, totalPages);
        i++
      ) {
        pageNumbers.push(i);
      }

      if (page < totalPages - range - 1) {
        pageNumbers.push("rightEllipsis");
      }
      if (page < totalPages - range) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      />
      {renderPageItems().map((item, index) => {
        if (typeof item === "number") {
          return (
            <Pagination.Item
              key={index}
              active={item === page}
              onClick={() => setPage(item)}
            >
              {item}
            </Pagination.Item>
          );
        } else if (item === "leftEllipsis") {
          return (
            <Pagination.Item
              key={index}
              onClick={() => handleEllipsisClick(-1)}
            >
              {activeEllipsis === -1 ? (
                <input
                  type="text"
                  value={inputPage}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageSubmit}
                  onBlur={() => setActiveEllipsis(null)}
                  style={{ width: "40px" }}
                  autoFocus
                />
              ) : (
                "\u2026"
              )}
            </Pagination.Item>
          );
        } else if (item === "rightEllipsis") {
          return (
            <Pagination.Item key={index} onClick={() => handleEllipsisClick(1)}>
              {activeEllipsis === 1 ? (
                <input
                  type="text"
                  value={inputPage}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageSubmit}
                  onBlur={() => setActiveEllipsis(null)}
                  style={{ width: "40px" }}
                  autoFocus
                />
              ) : (
                "\u2026"
              )}
            </Pagination.Item>
          );
        }
        return null;
      })}
      <Pagination.Next
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      />
    </Pagination>
  );
}
