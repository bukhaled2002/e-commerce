import { useLoaderData, useNavigate } from "react-router";

function Pagination() {
  const { totalPages, currentPage } = useLoaderData();
  const data = useLoaderData();
  const navigate = useNavigate();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const handlePageChange = (page) => {
    // Update the URL with the new page number
    const url = location.search;

    navigate(
      `${location.pathname}?${new URLSearchParams({
        ...Object.fromEntries(new URLSearchParams(url)),
        page,
      })}`
    );
  };
  return (
    <>
      <div className="join flex justify-center">
        {pages.map((page) => {
          console.log(+currentPage, +page);
          console.log(+currentPage === +page);
          return (
            <input
              key={page}
              className="join-item btn btn-square"
              type="radio"
              name="options"
              aria-label={page}
              checked={+currentPage === +page}
              onChange={() => handlePageChange(page)}
            />
          );
        })}
      </div>
    </>
  );
}

export default Pagination;
