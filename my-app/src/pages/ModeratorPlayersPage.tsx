import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BreadCrumbs from './components/BreadCrumbs';
import { api } from '../api';
import Cookies from 'js-cookie';
import Modal from './components/Modal'; // Компонент модального окна

import defaultImageUrl from "../assets/npc.png";
import axios from "axios";

interface Player {
    pk: number;
    f_name: string;
    l_name: string;
    date_birthday: string;
    image_player_url: string;
    birth_place: string;
    weight: string;
    height: string;
    position: string;
    number: string;
}

const ModeratorPlayersPage = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [updateError, setUpdateError] = useState('');
    const navigate = useNavigate();

    const fetchPlayers = async () => {
        setLoading(true);
        setError('');
        try {
            const sessionid = Cookies.get('sessionid');
            const response = await axios.get('/unauth/players/');
            Cookies.set('sessionid', sessionid);
            const PlayersData = response.data.filter((item) => item.pk !== undefined);
            setPlayers(PlayersData);
        } catch (err: any) {
            console.error('Ошибка при загрузке игроков:', err);
            if (err.response?.status === 403) {
                navigate('/403');
            } else if (err.response?.status === 404) {
                navigate('/404');
            } else {
                setError('Ошибка при загрузке игроков');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlayer = async (pk: number) => {
        try {
            await api.players.playersDeleteDelete(pk, {
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
            });
            setPlayers(players.filter((player) => player.pk !== pk));
        } catch (err: any) {
            console.error('Ошибка при удалении игрока:', err);
            if (err.response?.status === 403) {
                navigate('/403');
            } else if (err.response?.status === 404) {
                navigate('/404');
            }
        }
    };

    const openModal = (playerId: number) => {
        const player = players.find((p) => p.pk === playerId);
        if (player) setNewImageUrl(player.image_player_url || '');
        setCurrentPlayerId(playerId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentPlayerId(null);
        setNewImageUrl('');
        setUpdateError('');
    };

    const handleImageUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!newImageUrl || currentPlayerId === null) {
            setUpdateError('URL изображения не может быть пустым.');
            return;
        }

        try {
            const csrfToken = Cookies.get("csrftoken");
            await axios.post(
                '/api/players/image/',
                {
                    player_id: currentPlayerId,
                    image_player_url: newImageUrl,
                },
                {
                    headers: { 'X-CSRFToken': csrfToken },
                }
            );
            console.log(currentPlayerId, newImageUrl)
            fetchPlayers(); // Обновление списка игроков
            closeModal();
        } catch (err) {
            console.error('Ошибка обновления изображения:', err);
            setUpdateError('Не удалось обновить изображение.');
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <div className="bg-slate-100 font-roboto pb-4">
            <Navbar />
            <BreadCrumbs path="/manage_players" />
            <h2 className="sm:text-6xl text-5xl font-bold text-black ml-8 my-12">Спортсмены</h2>
            <div className="ml-4 font-arsik italic">
                <ul className="space-y-4">
                    {players.map((player: Player) => (
                        <li
                            key={player.pk}
                            className="shadow-lg transition-all duration-300 rounded-md border bg-white flex items-center relative p-4"
                        >
                            <img
                                src={player.image_player_url || defaultImageUrl}
                                alt={player.l_name}
                                className="rounded-md w-32 h-32 object-cover flex-shrink-0"
                            />
                            <Link to={`/players/${player.pk}`}
                                  className="flex-grow flex justify-between items-center pl-4">
                                <div>
                                    <div className="text-black font-bold text-xl">{player.l_name}</div>
                                    <div className="text-black text-lg">{player.position}</div>
                                </div>
                                <div className="text-[#250cb5] text-5xl font-bold">{player.number}</div>
                            </Link>
                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => openModal(player.pk)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
                                >
                                    Изменить изображение
                                </button>
                                <button
                                    onClick={() => navigate(`/manage-players/edit/${player.pk}`)}
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all duration-300"
                                >
                                    Редактировать игрока
                                </button>
                                <button
                                    onClick={() => handleDeletePlayer(player.pk)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-300"
                                >
                                    Удалить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="my-4 flex justify-center">
                <button
                    onClick={() => navigate('/manage-players/new')}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
                >
                    Добавить нового игрока
                </button>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <form onSubmit={handleImageUpdate} className="space-y-4">
                        <label>
                            <span className="text-gray-700">Введите URL изображения:</span>
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="mt-2 block w-full text-sm border rounded-md"
                            />
                        </label>
                        {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Обновить
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ModeratorPlayersPage;
