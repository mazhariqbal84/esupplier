import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import ReactPaginate from 'react-paginate';
const Pagination = ({
  totalPages,
  handlePageChange,
  className = "custom-class",
}) => {
  const [pages, setPages] = useState([]);
  const rangeStart = useEffect(() => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    setPages(pages);
  }, [totalPages]);

  const handlePageClick = (event) => {
    handlePageChange(event.selected + 1);
  };
  return (
    <div className={className}>
      <ReactPaginate
        className="pagination"
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel="<"
        renderOnZeroPageCount={null}
        activeClassName="active"
        activeLinkClassName="active"
        pageLinkClassName="!text-[12px] !p-[14px]"
      />
    </div>
  );
};

export default Pagination;
