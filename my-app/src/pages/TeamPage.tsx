import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar.tsx";
import Cookies from "js-cookie";
import defaultImageUrl from './../assets/npc.png';
import { setCurrentTeamId, setCurrentCount } from "../redux/playersSlice.tsx";

const TeamPage = () => {
    const { currentTeamId, currentCount } = useSelector((state) => state.players);
    const { teamId } = useParams();
    const [competition, setCompetition] = useState('');
    const [date_competition, setDateCompetition] = useState('');
    const [name_team, setNameTeam] = useState('');
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchTeamData = async () => {
        try {
            const response = await fetch(`/api/team/${teamId}/`);
            if (!response.ok) throw new Error("Ошибка загрузки данных!");
            const data = await response.json();
            setCurrentPlayers(data.players);
            setStatus(data.status);
            setCompetition(data.competition);
            setDateCompetition(data.date_competition);
            setNameTeam(data.name_team);
        } catch (error) {
            setErrorMessage("Заявка не найдена");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, [teamId]);

    const updateTournament = async () => {
        if (!competition || !name_team || !date_competition) {
            setErrorMessage("Заполните все данные");
            return;
        }
        try {
            const csrfToken = Cookies.get("csrftoken");
            const response = await fetch(`/api/team/${teamId}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ competition, name_team, date_competition }),
            });
            if (!response.ok) throw new Error("Ошибка при обновлении соревнования");
            alert("Соревнование успешно обновлено!");
            setErrorMessage('');
        } catch (error) {
            alert("Не удалось обновить соревнование.");
            console.error("Ошибка:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const csrfToken = Cookies.get("csrftoken");
            const response = await fetch(`/api/delete-team/${teamId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            });
            if (response.ok) {
                dispatch(setCurrentTeamId(null));
                dispatch(setCurrentCount(0));
                navigate("/players");
            } else {
                alert("Ошибка при удалении заявки");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleDeletePlayer = async (playerId) => {
        try {
            const csrfToken = Cookies.get("csrftoken");
            const response = await fetch(`/api/delete-from-team/${teamId}/player/${playerId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": csrfToken },
            });
            if (response.ok) {
                setCurrentPlayers(currentPlayers.filter((player) => player.pk !== playerId));
            } else {
                alert("Ошибка при удалении игрока");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleCaptainChange = async (playerId, isCaptain) => {
        try {
            const csrfToken = Cookies.get("csrftoken");
            const response = await fetch(`/api/add-is_captain/${teamId}/player/${playerId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ is_captain: isCaptain }),
            });
            if (response.ok) {
                setCurrentPlayers((prev) =>
                    prev.map((player) =>
                        player.pk === playerId ? { ...player, is_captain: isCaptain } : player
                    )
                );
            } else {
                alert("Ошибка при обновлении статуса капитана");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const handleFormTeam = async () => {
        try {
            const csrfToken = Cookies.get("csrftoken");
            const response = await fetch(`/api/form-team/${teamId}/`, {
                method: "PUT",
                headers: { "X-CSRFToken": csrfToken },
            });
            if (response.ok) {
                dispatch(setCurrentTeamId(null));
                dispatch(setCurrentCount(0));
                navigate("/players");
            } else {
                alert("Ошибка при формировании заявки");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-arsik">
            <Navbar />
            <div className="container mx-auto py-8">
                <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Моя заявка</h1>

                {/* Поля для ввода названия соревнования и даты */}
                <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
                    <div className="mb-4">
                        <label htmlFor="name_team" className="block text-gray-600 text-sm font-medium mb-2">
                            Название команды
                        </label>
                        <input
                            type="text"
                            id="name_team"
                            value={name_team}
                            onChange={(e) => setNameTeam(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите название команды"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="competition" className="block text-gray-600 text-sm font-medium mb-2">
                            Название соревнования
                        </label>
                        <input
                            type="text"
                            id="competition"
                            value={competition}
                            onChange={(e) => setCompetition(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите название соревнования"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date_competition" className="block text-gray-600 text-sm font-medium mb-2">
                            Дата соревнования
                        </label>
                        <input
                            type="text"
                            id="date_competition"
                            value={date_competition}
                            onChange={(e) => setDateCompetition(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите дату соревнования"
                        />
                    </div>
                    <button
                        onClick={updateTournament}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                        Обновить данные
                    </button>
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                </div>


                {/* Карточки игроков */}
                <div className="flex flex-col items-center mt-12">
                    <ul className="w-full">
                        {currentPlayers.map((player) => (
                            <li key={player.pk} className="bg-white rounded shadow-lg mb-5 flex items-center p-4">
                                <img src={player.image_player_url || defaultImageUrl} alt={player.l_name}
                                     className="h-32 w-32 object-cover rounded"/>
                                <div className="ml-5 flex flex-col justify-between w-full">
                                    <div>
                                        <h3 className="text-xl font-bold">{player.l_name}</h3>
                                        <p className="text-sm">{player.description}</p>
                                        <div className="flex items-center">
                                            <label htmlFor={`captain-${player.pk}`} className="mr-2">Капитан:</label>
                                            <input
                                                type="checkbox"
                                                id={`captain-${player.pk}`}
                                                checked={player.is_captain === 1}
                                                onChange={(e) => handleCaptainChange(player.pk, e.target.checked ? 1 : 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex mt-2 space-x-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                            onClick={() => handleDeletePlayer(player.pk)}
                                        >
                                            Удалить из заявки
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-between mt-12">
                    <button
                        onClick={handleFormTeam}
                        className="w-48 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all duration-300 text-center"
                    >
                        Сформировать заявку
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-48 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all duration-300 text-center"
                    >
                        Удалить заявку
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TeamPage;
