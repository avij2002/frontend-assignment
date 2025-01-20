import React, { useState, useEffect, useCallback } from "react";
import "./Table.css";
import { GITHUBUSERCONTENTURL } from "../utils/constant";

const Table = () => {
  const [maxPage, setMaxPage] = useState(0);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GITHUBUSERCONTENTURL);
        const data = await response.json();
        setMaxPage(Math.ceil(data.length / 5));
        setData(data);
      } catch (error) {
        setData([]);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getPaginatedData();
  }, [page, data]);

  const getPaginatedData = () => {
    const slicedData = data.slice((page - 1) * 5, page * 5);
    setPaginatedData(slicedData);
  };

  const handlePrevPageClick = useCallback(() => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  }, []);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const handleNextPageClick = useCallback(() => {
    setPage((prevPage) => Math.min(maxPage, prevPage + 1));
  }, [maxPage]);

  const generatePageButtons = () => {
    const range = 5;
    const startPageNumber = Math.max(1, page - 2);
    const endPageNumber = Math.min(maxPage, page + 2);
    const buttons = [];

    if (startPageNumber > 1) {
      buttons.push(
        <button
          key="start"
          className="pagination-button"
          onClick={() => handlePageClick(1)}
        >
          1
        </button>
      );
      if (startPageNumber > 2) {
        buttons.push(
          <span key="ellipsis-start" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPageNumber; i <= endPageNumber; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-button ${i === page ? "active" : ""}`}
          onClick={() => handlePageClick(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }

    if (endPageNumber < maxPage) {
      if (endPageNumber < maxPage - 1) {
        buttons.push(
          <span key="ellipsis-end" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={maxPage}
          className="pagination-button"
          onClick={() => handlePageClick(maxPage)}
        >
          {maxPage}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(
            ({
              "s.no": serialNumber,
              "percentage.funded": percentageFunded,
              "amt.pledged": amtPledged,
            }) => (
              <tr key={serialNumber}>
                <td>{serialNumber}</td>
                <td>{percentageFunded}</td>
                <td>{amtPledged}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={handlePrevPageClick}
          disabled={page === 1}
        >
          Prev
        </button>
        {generatePageButtons()}
        <button
          className="pagination-button"
          onClick={handleNextPageClick}
          disabled={page >= maxPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
