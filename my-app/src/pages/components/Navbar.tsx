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
                    <Link to="/players" className="text-black hover:text-gray-600 py-2 px-6">
                        Игроки
                    </Link>
                    <Link to="/login" className="text-black hover:text-gray-600 py-2 px-6">
                        Вход
                    </Link>
                    <Link to="/register" className="text-black hover:text-gray-600 py-2 px-6">
                        Регистрация
                    </Link>
                </>
            );
        } else if (is_staff === 'True') {
            return (
                <>
                    <Link to="/manage-players" className="text-black hover:text-gray-600 py-2 px-6">
                        Управление игроками
                    </Link>
                    <Link to="/manage-teams" className="text-black hover:text-gray-600 py-2 px-6">
                        Управление заявками
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-black hover:text-gray-600 py-2 px-6 focus:outline-none"
                    >
                        Выйти
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/players" className="text-black hover:text-gray-600 py-2 px-6">
                        Игроки
                    </Link>
                    <Link to="/teams" className="text-black hover:text-gray-600 py-2 px-6">
                        Заявки
                    </Link>
                    <Link to="/profile" className="text-black hover:text-gray-600 py-2 px-6">
                        Личный кабинет ({username})
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-black hover:text-gray-600 py-2 px-6 focus:outline-none"
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
