import ReactPaginate from 'react-paginate';

interface PaginationProps {
	totalPages: number;
	handlePageClick: (event: any) => void;
}

const Pagination = (props: PaginationProps) => {
	return (
		<ReactPaginate
			nextLabel="next >"
			onPageChange={props.handlePageClick}
			pageRangeDisplayed={3}
			marginPagesDisplayed={2}
			pageCount={props.totalPages}
			previousLabel="< previous"
			pageClassName="page-item"
			pageLinkClassName="page-link"
			previousClassName="page-item"
			previousLinkClassName="page-link"
			nextClassName="page-item"
			nextLinkClassName="page-link"
			breakLabel="..."
			breakClassName="page-item"
			breakLinkClassName="page-link"
			containerClassName="pagination mt-4 flex flex-row justify-end"
			activeClassName="pagination-active"
			renderOnZeroPageCount={null}
		/>
	);
};

export default Pagination;
