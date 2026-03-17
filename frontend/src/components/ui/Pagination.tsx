import Link from "next/link";

type PaginationProps = {
    page: number;
    totalPages: number;
    baseUrl: string;
};

export default function Pagination({ page, totalPages, baseUrl }: PaginationProps) {

    // rango de páginas a mostrar
    const pageLimit = 5; // Número de páginas a mostrar como máximo
    let startPage = Math.max(1, page - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);

    if (endPage - startPage + 1 < pageLimit) {
        startPage = Math.max(1, endPage - pageLimit + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <nav className="flex justify-center py-10">
            {/* Botón de página anterior */}
            {page > 1 && (
                <Link
                    href={`${baseUrl}?page=${page - 1}`}
                    className="border #023D71 px-4 py-2 text-white font-bold bg-[#023D71] text-[16px] rounded ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                >
                    &laquo;
                </Link>
            )}

            {/* Rango de páginas */}
            {page > 1 && startPage > 1 && (
                <Link
                    href={`${baseUrl}?page=1`}
                    className="border #023D71 px-4 py-2 text-[#023D71] text-[16px] rounded ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                >
                    1
                </Link>
            )}

            {startPage > 2 && <span className="px-2">...</span>}

            {pages.map(currentPage => (
                <Link
                    key={currentPage}
                    href={`${baseUrl}?page=${currentPage}`}
                    className={`${page === currentPage
                        ? "text-white font-bold bg-[#023D71]"
                        : "text-[#023D71]"
                        } border #023D71 px-4 py-2 text-[16px] rounded ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                >
                    {currentPage}
                </Link>
            ))}

            {endPage < totalPages - 1 && <span className="px-2">...</span>}

            {endPage < totalPages && (
                <Link
                    href={`${baseUrl}?page=${totalPages}`}
                    className="border #023D71 px-4 py-2 text-[#023D71] text-[16px] rounded ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                >
                    {totalPages}
                </Link>
            )}

            {/* Botón de página siguiente */}
            {page < totalPages && (
                <Link
                    href={`${baseUrl}?page=${page + 1}`}
                    className="border #023D71 px-4 py-2 text-white font-bold bg-[#023D71] text-[16px] rounded ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                >
                    &raquo;
                </Link>
            )}
        </nav>
    );
}