
import React from "react";

const Pagination = ({ recordsPerPage, totalRecords, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPageNumbers = Math.ceil(totalRecords / recordsPerPage);

    for (let i = 1; i <= totalPageNumbers; i++) {
        pageNumbers.push(i);
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPageNumbers) {
            paginate(currentPage + 1);
        }
    };

    const getVisiblePageNumbers = () => {
        const maxVisiblePages = 3;
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);
        let start = currentPage - halfVisiblePages;
        let end = currentPage + halfVisiblePages;
    
        if (start < 1) {
            start = 1;
            end = Math.min(maxVisiblePages, totalPageNumbers);
        }
    
        if (end > totalPageNumbers) {
            end = totalPageNumbers;
            start = Math.max(1, end - maxVisiblePages + 1);
        }
    
        if (totalPageNumbers <= maxVisiblePages) {
            start = 1;
            end = totalPageNumbers;
        }
    
        return pageNumbers.slice(start - 1, end);
    };
    

    const visiblePageNumbers = getVisiblePageNumbers();

    return (
        <div className="flex justify-center items-center mt-2 ">
            <nav className="pagination flex items-center space-x-2 bg-white rounded-lg">
                <button
                    onClick={handlePrevPage}
                    className={`px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    &lt; Previous
                </button>
                {visiblePageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-lg border border-gray-300  hover:bg-gray-400 ${currentPage === number ? 'bg-gray-400 text-black' : ''}`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    className={`px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 ${currentPage === totalPageNumbers ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === totalPageNumbers}
                >
                    Next &gt;
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
