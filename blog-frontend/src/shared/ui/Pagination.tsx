interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div
      className={`flex justify-center gap-2 items-center mt-4 px-4 ${className}`}
    >
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="bg-gray-500 w-40 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <p className="text-center w-64">
        Page {currentPage} of {totalPages}
      </p>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="bg-gray-500 w-40 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
