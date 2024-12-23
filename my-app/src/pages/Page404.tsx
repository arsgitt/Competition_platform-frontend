import { useNavigate } from "react-router-dom";

const Page404 = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-red-500 animate-bounce">404</h1>
                <p className="text-2xl text-gray-700 mt-4">
                    Страница не найдена!
                </p>
                <p className="text-lg text-gray-600 mt-2">
                    Возможно, вы ввели неверный URL или страница была удалена.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-8 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-all duration-300"
                >
                    Вернуться на главную страницу
                </button>
            </div>
        </div>
    );
};

export default Page404;
