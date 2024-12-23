const ImageModal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-md shadow-lg relative">
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={onClose}
            >
                ✕
            </button>
            {children}
        </div>
    </div>
);

export default ImageModal;
