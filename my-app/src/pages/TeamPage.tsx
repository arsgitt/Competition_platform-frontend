import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar.tsx";
import defaultImageUrl from './../assets/npc.png';
import {
    fetchTeamData,
    updateTournament,
    deleteTeam,
    deletePlayerFromTeam,
    updateCaptainStatus,
    formTeam,
} from "../redux/teamSlice.tsx";

const TeamPage = () => {
    const { currentPlayers, name_team, competition, date_competition, status, errorMessage, loading } = useSelector(
        (state) => state.team
    );
    const { teamId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamData(teamId));
        }
    }, [teamId, dispatch]);

    const handleUpdateTournament = () => {
        if (!competition || !name_team || !date_competition) {
            alert("Заполните все данные");
            return;
        }
        dispatch(updateTournament({ teamId, competition, name_team, date_competition }));
    };

    const handleDelete = () => {
        dispatch(deleteTeam(teamId)).then(() => {
            navigate("/players");
        });
    };

    const handleDeletePlayer = (playerId) => {
        dispatch(deletePlayerFromTeam({ teamId, playerId }));
    };

    const handleCaptainChange = (playerId, isCaptain) => {
        dispatch(updateCaptainStatus({ teamId, playerId, isCaptain }));
    };

    const handleFormTeam = () => {
        dispatch(formTeam(teamId)).then(() => {
            navigate("/players");
        });
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
                            onChange={(e) => dispatch({ type: "teams/setNameTeam", payload: e.target.value })}
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
                            onChange={(e) => dispatch({ type: "teams/setCompetition", payload: e.target.value })}
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
                            onChange={(e) => dispatch({ type: "teams/setDateCompetition", payload: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring focus:ring-gray-400"
                            placeholder="Введите дату соревнования"
                        />
                    </div>
                    <button
                        onClick={handleUpdateTournament}
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
                                <img
                                    src={player.image_player_url || defaultImageUrl}
                                    alt={player.l_name}
                                    className="h-32 w-32 object-cover rounded"
                                />
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
