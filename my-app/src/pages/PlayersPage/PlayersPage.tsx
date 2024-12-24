import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import BreadCrumbs from "../components/BreadCrumbs.tsx";
import PALMER from '../../assets/palmer.webp';
import JACKSON from '../../assets/jackson.webp';
import JAMES from '../../assets/james.webp';
import defaultImageUrl from '../../assets/npc.png';
import basket from '../../assets/basket.png';
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers, fetchTeamCount, searchPlayers, addPlayer, setInputValue } from "../../redux/playersSlice";




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

const mockPlayers = [
    { pk: 1, l_name: 'PALMER', position: 'MIDFIELDER', image_player_url: PALMER, number: '20' },
    { pk: 2, l_name: 'JAMES', position: 'DEFENDER', image_player_url: JAMES, number: '24' },
    { pk: 3, l_name: 'JACKSON', position: 'FORWARD', image_player_url: JACKSON, number: '15' },
];

const PlayersPage = () => {
    const { players, inputValue, currentTeamId, currentCount, status, error } = useSelector((state) => state.players);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPlayers());
        dispatch(fetchTeamCount());
    }, [dispatch]);

    const handleSearch = (event) => {
        event.preventDefault();
        dispatch(searchPlayers(inputValue));
    };

    const handleAddPlayer = (playerId) => {
        dispatch(addPlayer(playerId));
    };

    return (
        <div className="bg-slate-100 font-roboto">
            <Navbar/>
            <BreadCrumbs path="/players"/>
            <form onSubmit={handleSearch} className="flex justify-center mb-16 mt-12 space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => dispatch(setInputValue(event.target.value))}
                    placeholder="Поиск..."
                    className="p-2 w-56 sm:w-3/4 h-9 border rounded-md"
                />
                <button
                    type="submit"
                    className="bg-slate-300 border-black border rounded-md w-20 sm:w-28 text-black hover:bg-slate-500 hover:text-white transition-all duration-300"
                >
                    Поиск
                </button>
            </form>
            <h2 className="sm:text-6xl text-5xl font-bold text-black ml-8">Спортсмены</h2>
            <div className="ml-4 font-arsik italic">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player: Player) => (
                        <li key={player.pk} className="shadow-lg transition-all duration-300 rounded-md border m-5 bg-white relative">
                            <img
                                src={player.image_player_url || defaultImageUrl}
                                alt={player.l_name}
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
                            <div className="p-4">
                                <button
                                    onClick={() => handleAddPlayer(player.pk)}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
                                >
                                    Добавить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Условный рендеринг корзины */}
            {isAuthenticated && currentCount > 0 && (
                <div className="fixed bottom-2 right-2">
                    <Link to={`/team/${currentTeamId}/`} className="no-underline">
                        <div className="relative">
                            <img className="bg-[#FCDD9F] h-16 w-16 rounded-full shadow-lg" src={basket} alt="store icon"/>
                            <div
                                className="absolute top-10 left-10 flex items-center justify-center w-6 h-6 bg-[#A67B5B] border border-white rounded-full">
                                <p className="font-roboto text-white font-bold text-lg">{currentCount}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PlayersPage;