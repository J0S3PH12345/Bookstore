interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({currentPage, totalPages, pageSize, onPageChange, onPageSizeChange}:PaginationProps) => {
return (
    <div className="flex item-center justify-center mt-4">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
    </button>
    <span>
        {' '}
        Page {currentPage} of {totalPages}{' '}
    </span>
    <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        Next
    </button>

<label>
        Books per page:
        <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
        </select>
        </label>
    </div>
    );
};

export default Pagination;