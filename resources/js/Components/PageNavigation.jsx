import { router } from "@inertiajs/react";

const PageNavigation = ({ laporan }) => {
    const handlePageChange = (url) => {
        router.get(url);
    };
    return (
        <div className="flex justify-between items-center max-w-[1080px] m-auto text-black">
            <div>
                Page {laporan.current_page} of {laporan.last_page}
            </div>
            <div>
                {laporan.links.map((link, index) => (
                    <button
                        key={index}
                        className="p-2 hover:bg-gray-300 rounded"
                        onClick={() => handlePageChange(link.url)}
                        disabled={!link.url || link.active}
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
export default PageNavigation;
