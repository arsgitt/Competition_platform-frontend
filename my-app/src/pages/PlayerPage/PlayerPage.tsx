import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar.tsx";
import BreadCrumbs from "../components/BreadCrumbs.tsx";
// import BreadCrumbs from "./components/BreadCrumbs.tsx";


const mockPlayers = [
    { id: 1, f_name: 'PALMER', l_name: 'COLE', date_of_birth: '01-01-2000', place_of_birth: 'Тушино', weight: '60',
        height: '177', position: 'MIDFIELDER', image_player_url: '/palmer.webp', number: '20'},
    { id: 2, f_name: 'JAMES', l_name: 'REECE', date_of_birth: '02-01-2000', place_of_birth: 'Тушино', weight: '80',
        height: '172', position: 'DEFENDER', image_player_url: '/james.webp', number: '24'},
    { id: 3, f_name: 'JACKSON', l_name: 'NICOLAS', date_of_birth: '03-01-2000', place_of_birth: 'Тушино', weight: '75',
        height: '185', position: 'FORWARD', image_player_url: '/jackson.webp', number: '15'},
];


const PlayerDescriptionPage = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true); // Для отображения состояния загрузки
    const [error, setError] = useState(""); // Для обработки ошибок

    const fetchPlayer = async () => {
        try {
            const response = await fetch(`/api/players/${playerId}/`);

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const playerData = await response.json();
            setPlayer(playerData);
        } catch (err) {
            // Если произошла ошибка, используем мок-данные
            const mockPlayer = mockPlayers.find(item => item.id === parseInt(playerId, 10));

            if (mockPlayer) {
                setPlayer(mockPlayer);
            } else {
                setError('Игрок не найден');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPlayer();
    }, [playerId]);

    // Обработка состояния загрузки и ошибок
    if (loading) {
        return <div className="text-center my-5">Загрузка данных игрока...</div>;
    }

    if (error) {
        return <div className="text-danger text-center my-5">Ошибка: {error}</div>;
    }

    return (
        <div className="bg-slate-100 font-roboto min-h-screen flex flex-col">
            <Navbar/>
            <BreadCrumbs path={`/players/${player.l_name}`} />
            <div className="container mx-auto p-4">
                <div className="flex">
                    <div className="w-2/3 space-y-36">
                        <div className="flex items-center mb-4">
                            <div className="font-arsik2 text-9xl font-bold mr-4">{player.number}</div>
                            <div className="ml-5">
                                <div className="text-3xl font-semibold">{player.l_name}</div>
                                <div className="text-5xl font-semibold">{player.f_name}</div>
                            </div>
                        </div>
                        <div className="mb-4 bg-gray-200 p-4 rounded-md border border-gray-400">
                            <div className="grid grid-cols-4 gap-4 mb-2 border-b border-gray-400 pb-2">
                                <div className="font-semibold border-r border-gray-400 px-2">Дата рождения</div>
                                <div className="font-semibold border-r border-gray-400 px-2">Место рождения</div>
                                <div className="font-semibold border-r border-gray-400 px-2">Рост</div>
                                <div className="font-semibold">Вес</div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="border-r border-gray-400 px-2">{player.date_birthday}</div>
                                <div className="border-r border-gray-400 px-2">{player.birth_place}</div>
                                <div className="border-r border-gray-400 px-2">{player.height} см</div>
                                <div>{player.weight} кг</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 ml-7 bg-[#0A1A55] border rounded">
                        <img src={player.image_player_url} alt={player.f_name}
                             className="rounded-md w-full h-72 object-cover"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="ml-5">
                                <div className="text-[#767676] font-bold text-2xl">Позиция</div>
                                <div className="text-white text-2xl">{player.position}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerDescriptionPage;