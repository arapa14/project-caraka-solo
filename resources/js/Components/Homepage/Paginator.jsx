import { Link } from "@inertiajs/react";

const Paginator = ({ meta }) => {
    if (!meta || !meta.links) {
        return null; // Jika meta atau links undefined, tidak menampilkan Paginator
    }

    const prev = meta.links.find(link => link.label === '&laquo; Previous')?.url;
    const next = meta.links.find(link => link.label === 'Next &raquo;')?.url;
    const current = meta.current_page;

    return (
        <div className="flex justify-center items-center my-4">
            {prev && (
                <Link href={prev} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-l-md hover:bg-gray-300 transition duration-300 ease-in-out">
                    «
                </Link>
            )}
            <button className="px-4 py-2 bg-gray-200 text-gray-800 border-t border-b border-gray-300 disabled:bg-gray-300" disabled>
                {current} {/* Tampilkan halaman saat ini */}
            </button>
            {next && (
                <Link href={next} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300 transition duration-300 ease-in-out">
                    »
                </Link>
            )}
        </div>
    );
};

export default Paginator;
