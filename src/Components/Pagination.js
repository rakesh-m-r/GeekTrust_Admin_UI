import React from "react";
import classnames from "classnames";
import "./pagination.scss";
import { usePagination, DOTS } from "../Hooks/usePaginations";
const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const onFirst = () => {
    onPageChange(1);
  };
  let lastPage = paginationRange?.[paginationRange.length - 1];

  const onLast = () => {
    onPageChange(lastPage);
  };
  return (
    <ul
      className={classnames("pagination-container", { [className]: className })}
    >
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === 1
        })}
        onClick={onFirst}
      >
        <div>
          <box-icon name="chevrons-left"></box-icon>
        </div>
      </li>

      <li
        className={classnames("pagination-item", {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div>
          <box-icon name="chevron-left"></box-icon>
        </div>
      </li>
      {paginationRange?.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li
            className={classnames("pagination-item", {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div>
          <box-icon name="chevron-right"></box-icon>
        </div>
      </li>
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage
        })}
        onClick={onLast}
      >
        <div>
          <box-icon name="chevrons-right"></box-icon>
        </div>
      </li>
    </ul>
  );
};

export default Pagination;
