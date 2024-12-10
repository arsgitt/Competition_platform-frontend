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
    const { isAuthenticated, username } = useSelector((state) => state.auth); // Получаем данные о пользователе из Redux состояния
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для мобильного меню

    // Функция открытия/закрытия меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Функция для выхода
    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies

            const response = await axios.post('/api/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken, // Подставляем CSRF токен в заголовок запроса
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 204) {
                dispatch(setPlayers([]));
                dispatch(setInputValue(''));
                dispatch(setCurrentTeamId(null));
                dispatch(setCurrentCount(0));
                dispatch(logout()); // Вызываем экшен для логута в Redux
                navigate('/login'); // Перенаправляем на страницу логина
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            alert('Ошибка при выходе. Пожалуйста, попробуйте позже.');
        }
    };
    return (
        <header className="text-white py-4 px-6 flex justify-between items-center font-roboto">
            {/* Логотип и заголовок */}
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
                <Link to="/players" className="text-black hover:text-gray-300 duration-300 cursor-pointer">
                    Игроки
                </Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/teams" className="text-black hover:text-gray-300 duration-300 cursor-pointer">
                            Заявки
                        </Link>
                        <Link to="/profile" className="text-black hover:text-gray-300 duration-300 cursor-pointer">
                            Личный кабинет ({username})
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-black hover:text-gray-300 duration-300 cursor-pointer"
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-black hover:text-gray-300 duration-300 cursor-pointer">
                            Вход
                        </Link>
                        <Link to="/register" className="text-black hover:text-gray-300 duration-300 cursor-pointer">
                            Регистрация
                        </Link>
                    </>
                )}
            </nav>

            {/* Кнопка мобильного меню */}
            <button className="md:hidden" onClick={toggleMenu}>
                <img src={menu} alt="menu" className="w-6 h-6" />
            </button>

            {/* Мобильное меню */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-400 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full p-4 mt-3">
                    <button className="self-start mb-7" onClick={toggleMenu}>
                        <img src={menu} alt="menu2" className="w-6 h-6" />
                    </button>
                    <Link to="/players" className="text-white mb-2 cursor-pointer">
                        Игроки
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/teams" className="text-white mb-2 cursor-pointer">
                                Заявки
                            </Link>
                            <Link to="/profile" className="text-white mb-7 cursor-pointer">
                                Личный кабинет ({username})
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none cursor-pointer"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block py-2 hover:text-gray-300 mt-5 cursor-pointer">
                                Вход
                            </Link>
                            <Link to="/register" className="block py-2 hover:text-gray-300 cursor-pointer">
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );


};

export default Navbar;
