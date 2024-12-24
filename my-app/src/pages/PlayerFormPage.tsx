import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import BreadCrumbs from './components/BreadCrumbs';
import axios from "axios";

const PlayerFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState({
        f_name: '',
        l_name: '',
        date_birthday: '',
        image_player_url: '',
        birth_place: '',
        weight: 0,
        height: 0,
        position: '',
        number: 0
    });
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchPlayer = async () => {
                setLoading(true);
                try {
                    const sessionid = Cookies.get('sessionid');
                    const response = await axios.get(`/unauth/players/${id}/`);
                    Cookies.set('sessionid', sessionid);
                    setPlayer(response.data);
                } catch (err) {
                    console.error('Error loading player:', err);
                    if (err.response?.status === 403) {
                        navigate('/403');
                    } else if (err.response?.status === 404) {
                        navigate('/404');
                    } else {
                        setError('Failed to load player data.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchPlayer();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlayer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (id) {
                // Update player
                await api.players.playersUpdateUpdateUpdate(id, player, {
                    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
                });
            } else {
                // Create player
                await api.players.playersCreateCreate(player, {
                    headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
                });
            }
            navigate('/manage-players');
        } catch (err) {
            console.error('Error saving player:', err);
            if (err.response?.status === 403) {
                navigate('/403');
            } else if (err.response?.status === 404) {
                navigate('/404');
            } else {
                setError('Failed to save player. Please check your inputs.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-roboto">
            <Navbar />
            <BreadCrumbs path="/form_player" />

            <div className="container mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {id ? 'Редактирование игрока' : 'Создание нового игрока'}
                </h2>

                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {error && (
                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="f_name" className="block text-sm font-medium text-gray-700">
                                Имя
                            </label>
                            <input
                                type="text"
                                id="f_name"
                                name="f_name"
                                value={player.f_name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="l_name" className="block text-sm font-medium text-gray-700">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                id="l_name"
                                name="l_name"
                                value={player.l_name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date_birthday" className="block text-sm font-medium text-gray-700">
                                Дата рождения
                            </label>
                            <input
                                type="date"
                                id="date_birthday"
                                name="date_birthday"
                                value={player.date_birthday}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="image_player_url" className="block text-sm font-medium text-gray-700">
                                Фото
                            </label>
                            <input
                                type="text"
                                id="image_player_url"
                                name="image_player_url"
                                value={player.image_player_url}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="birth_place" className="block text-sm font-medium text-gray-700">
                                Место рождения
                            </label>
                            <input
                                type="text"
                                id="birth_place"
                                name="birth_place"
                                value={player.birth_place}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                    Вес (кг)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={player.weight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                    Рост (см)
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={player.height}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Позиция на поле
                            </label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={player.position}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                                Игровой номер
                            </label>
                            <input
                                type="number"
                                id="number"
                                name="number"
                                value={player.number}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {id ? 'Сохранить изменения' : 'Создать игрока'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PlayerFormPage;
