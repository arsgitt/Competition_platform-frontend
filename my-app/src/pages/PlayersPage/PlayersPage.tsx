import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import BreadCrumbs from "../components/BreadCrumbs.tsx";


const mockPlayers = [
    { pk: 1, l_name: 'PALMER', position: 'MIDFIELDER', image_player_url: '/palmer.webp', number: '20'},
    { pk: 2, l_name: 'JAMES', position: 'DEFENDER', image_player_url: '/james.webp', number: '24'},
    { pk: 3, l_name: 'JACKSON', position: 'FORWARD', image_player_url: '/jackson.webp', number: '15'},
];

const PlayersPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [players, setPlayers] = useState(mockPlayers);
    const [filteredPlayers, setFilteredPlayers] = useState(mockPlayers);
    const [currentTeamId, setCurrentTeamId] = useState(null);
    const [currentCount, setCurrentCount] = useState(0);
    const fetchPlayers = async () => {
        try {
            const response = await fetch('/api/players/');
            const PlayersData = await response.json();
            const filteredData = PlayersData.filter(item => item.pk !== undefined);
            const teamIdData = PlayersData.find(item => item.draft_request_id);
            const teamCountData = PlayersData.find(item => item.count);
            setPlayers(filteredData);
            setFilteredPlayers(filteredData);
            setCurrentTeamId(teamIdData?.draft_request_id || null);
            setCurrentCount(teamCountData?.count || 0);
        } catch (error) {
            console.error('Ошибка при загрузке данных игроков:', error);
            setPlayers(mockPlayers);
            setFilteredPlayers(mockPlayers);
            const requestData = mockPlayers.find(item => item);
            setCurrentTeamId(requestData?.draft_request_id || null);
            setCurrentCount(requestData?.count || 0);
        }
    };
    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleSearch = async (l_name) => {
        l_name.preventDefault();
        try {
            const response = await fetch(`/api/players/?l_name=${inputValue}`);
            const result = await response.json();
            const filteredResult = result.filter(item => item.pk !== undefined);
            setFilteredPlayers(filteredResult);
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
        }
    };

    return (
        <div className="bg-slate-100 font-roboto">
            <Navbar/>
            <BreadCrumbs path="/players"/>
            <form onSubmit={handleSearch} className="flex justify-center mb-16 mt-12 space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(l_name) => setInputValue(l_name.target.value)}
                    placeholder="Поиск..."
                    className="p-2 w-3/4 h-9 border rounded-md"
                />
                <button type="submit"
                        className="bg-slate-300 border-black border rounded-md w-28 text-black hover:bg-slate-500 hover:text-white transition-all duration-300">Поиск
                </button>
            </form>
            <h2 className="text-6xl font-bold text-black ml-8">Спортсмены</h2>
            <div className="ml-4 font-arsik italic">
                <ul className="grid grid-cols-3 gap-4">
                    {filteredPlayers.map(player => (
                        <li key={player.pk}
                            className="shadow-lg transition-all duration-300 rounded-md border m-5 bg-white relative">
                            <img src={player.image_player_url} alt={player.l_name}
                                 className="rounded-md w-full h-72 object-cover"
                            />
                            <Link to={`/players/${player.pk}`}>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="ml-5">
                                        <div className="text-black font-bold text-2xl">{player.l_name}</div>
                                        <div className="text-black text-2xl">{player.position}</div>
                                    </div>
                                    <div className="text-[#250cb5] text-6xl mr-5">{player.number}</div>
                                </div>
                            </Link>

                            <div className="m-0 p-0">
                                <button
                                    className="pointer-events-none w-full bg-white text-gray-900 border rounded mt-2 transition-all duration-500 hover:bg-[#060F1E] hover:text-white"

                                >
                                    Добавить в заявку
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="fixed bottom-2 right-2">
                <Link to="#" className="no-underline pointer-events-none">
                    <div className="relative">
                        <img className="bg-[#FCDD9F] h-16 w-16 rounded-full shadow-lg"
                             src="/basket.png"
                             alt="store icon"/>
                        <div
                            className="absolute top-10 left-10 flex items-center justify-center w-6 h-6 bg-[#A67B5B] border border-white rounded-full">
                            <p className="font-roboto text-white font-bold text-lg">{currentCount}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>

    )
}


export default PlayersPage;
