import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerAsync } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';

const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerAsync({ email, username, password })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-32 h-auto cursor-pointer" />
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Регистрация</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    {status === 'failed' && <div className="text-red-500 text-center">{error}</div>}
                    <div>
                        <label htmlFor="email" className="block text-gray-600 text-sm mb-1">Электронная почта</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-gray-600 text-sm mb-1">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-600 text-sm mb-1">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                        {status === 'loading' ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
