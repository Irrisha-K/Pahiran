import "./FiltersAndPagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="paginations">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`page-btn ${i + 1 === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
