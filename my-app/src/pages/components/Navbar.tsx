import { Link, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.webp'; // Логотип
import menu from '../../assets/menu2.png'; // Иконка меню
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import axios from 'axios';
import { useState } from 'react';
import {
    setPlayers,
    setInputValue,
    setCurrentCount,
    setCurrentTeamId
} from "../../redux/playersSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, username, is_staff } = useSelector((state) => state.auth); // Добавлено поле isModerator
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Функция открытия/закрытия меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Функция для выхода
    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const csrfToken = Cookies.get('csrftoken');

            const response = await axios.post('/api/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 204) {
                dispatch(setPlayers([]));
                dispatch(setInputValue(''));
                dispatch(setCurrentTeamId(null));
                dispatch(setCurrentCount(0));
                dispatch(logout());
                Cookies.remove('is_staff');
                navigate('/login');
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            alert('Ошибка при выходе. Пожалуйста, попробуйте позже.');
        }
    };

    // Генерация навигационных ссылок
    const renderNavLinks = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <Link to="/players" className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
                        Игроки
                    </Link>
                    <Link to="/login" className="inline-block py-2 px-6 bg-white text-black rounded-md hover:bg-gray-100">
                        Вход
                    </Link>
                    <Link to="/register" className="inline-block py-2 px-6 bg-black text-white rounded-md hover:bg-gray-800">
                        Регистрация
                    </Link>
                </>
            );
        } else if (is_staff === 'True') {
            return (
                <>
                    <Link to="/manage-players" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
                        Управление игроками
                    </Link>
                    <Link to="/manage-teams" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
                        Управление заявками
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Выйти
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/players" className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
                        Игроки
                    </Link>
                    <Link to="/teams" className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
                        Заявки
                    </Link>
                    <Link to="/profile" className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600">
                        Личный кабинет ({username})
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Выйти
                    </button>
                </>
            );
        }
    };

    return (
        <header className="text-white py-4 px-6 flex justify-between items-center font-roboto">
            {/* Логотип */}
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-12 h-12">
                        <img src={LOGO} alt="logo" />
                    </div>
                    <p className="text-black hover:text-gray-300 duration-300">
                        Спортивные соревнования
                    </p>
                </Link>
            </div>

            {/* Навигация */}
            <nav className="hidden md:flex space-x-4">
                {renderNavLinks()}
            </nav>

            {/* Кнопка мобильного меню */}
            <button className="md:hidden" onClick={toggleMenu}>
                <img src={menu} alt="menu" className="w-6 h-6" />
            </button>

            {/* Мобильное меню */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-400 transform transition-transform duration-300 ease-in-out z-50 ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full p-4 mt-3">
                    <button className="self-start mb-7" onClick={toggleMenu}>
                        <img src={menu} alt="menu2" className="w-6 h-6"/>
                    </button>
                    {renderNavLinks()}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
