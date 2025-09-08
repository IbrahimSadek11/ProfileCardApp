import React from "react";

function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={currentPage === 1}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <span>{currentPage} / {totalPages}</span>
      <button onClick={onNext} disabled={currentPage === totalPages}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}

export default Pagination;
