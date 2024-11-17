const Preview = ({ modalRef, viewPhotoRef }) => (
    <dialog
        ref={modalRef}
        className="bg-transparent backdrop:bg-[rgb(0,0,0,0.2)]"
    >
        <div className="bg-white p-2 rounded">
            <i
                className="fi fi-br-cross cursor-pointer text-black"
                onClick={() => modalRef.current.close()}
            ></i>
            <hr />
            <img ref={viewPhotoRef} className="max-h-[85vh] p-2" />
        </div>
    </dialog>
);

export default Preview;
