import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import Cookie from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            Cookie.remove('csrftoken');
            Cookie.remove('sessionid');
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const is_staff = Cookie.get('is_staff');

                dispatch(login({ username, is_staff }));

                if (is_staff === 'True') {
                    navigate('/manage-players');
                } else {
                    navigate('/players');
                }

            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка при входе. Пожалуйста, попробуйте позже.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-32 h-auto cursor-pointer" />
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Войти в аккаунт</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <div>
                        <label htmlFor="username" className="block text-gray-600 text-sm mb-1">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите имя пользователя"
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
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                        Войти
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p className="mt-4">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Зарегистрируйтесь
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
