import {useEffect} from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import BreadCrumbs from "../components/BreadCrumbs.tsx";
import PALMER from '../../assets/palmer.webp';
import JACKSON from '../../assets/jackson.webp';
import JAMES from '../../assets/james.webp';
import defaultImageUrl from '../../assets/npc.png';
import {useDispatch, useSelector} from "react-redux";
import {setInputValue, setPlayers} from "../../redux/playersSlice.tsx";

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
    { pk: 1, l_name: 'PALMER', position: 'MIDFIELDER', image_player_url: PALMER, number: '20'},
    { pk: 2, l_name: 'JAMES', position: 'DEFENDER', image_player_url: JAMES, number: '24'},
    { pk: 3, l_name: 'JACKSON', position: 'FORWARD', image_player_url: JACKSON, number: '15'},
];

const PlayersPage = () => {
    // const [inputValue, setInputValue] = useState('');
    // const [players, setPlayers] = useState(mockPlayers);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { players, inputValue } = useSelector((state) => state.players);
    const dispatch = useDispatch();
    // const [currentTeamId, setCurrentTeamId] = useState(null);
    // const [currentCount, setCurrentCount] = useState(0);
    const fetchPlayers = async () => {
        if (players.length === 0) {
            try {
                const response = await fetch('http://localhost:8000/players/');
                const PlayersData = await response.json();
                const filteredData = PlayersData.filter((item: { pk: undefined; }) => item.pk !== undefined);
                // const teamIdData = PlayersData.find(item => item.draft_request_id);
                // const teamCountData = PlayersData.find(item => item.count);
                dispatch(setPlayers(filteredData));
                // setCurrentTeamId(teamIdData?.draft_request_id || null);
                // setCurrentCount(teamCountData?.count || 0);
            } catch (error) {
                console.error('Ошибка при загрузке данных игроков:', error);
                dispatch(setPlayers(mockPlayers));
                // const requestData = mockPlayers.find(item => item);
                // setCurrentTeamId(requestData?.draft_request_id || null);
                // setCurrentCount(requestData?.count || 0);
            }
        }
    };
    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleSearch = async (l_name: { preventDefault: () => void; }) => {
        l_name.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/players/?l_name=${inputValue}`);
            const result = await response.json();
            const filteredResult = result.filter((item: { pk: undefined; }) => item.pk !== undefined);
            dispatch(setPlayers(filteredResult));
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
            const filteredPlayers = mockPlayers.filter(player => {
                const search_lname = inputValue
                    ? player.l_name.toLowerCase().includes(inputValue.toLowerCase())
                    : true;
                return search_lname;
            });
            dispatch(setPlayers(filteredPlayers))
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
                    onChange={(l_name) => dispatch(setInputValue(l_name.target.value))}
                    placeholder="Поиск..."
                    className="p-2 w-56 sm:w-3/4 h-9 border rounded-md"
                />
                <button type="submit"
                        className="bg-slate-300 border-black border rounded-md w-20 sm:w-28 text-black hover:bg-slate-500 hover:text-white transition-all duration-300">Поиск
                </button>
            </form>
            <h2 className="sm:text-6xl text-5xl font-bold text-black ml-8">Спортсмены</h2>
            <div className="ml-4 font-arsik italic">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player: Player) => (
                        <li key={player.pk}
                            className="shadow-lg transition-all duration-300 rounded-md border m-5 bg-white relative">
                            <img src={player.image_player_url || defaultImageUrl} alt={player.l_name}
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

                            {/*<div className="m-0 p-0">*/}
                            {/*    <button*/}
                            {/*        className="pointer-events-none w-full bg-white text-gray-900 border rounded mt-2 transition-all duration-500 hover:bg-[#060F1E] hover:text-white"*/}

                            {/*    >*/}
                            {/*        Добавить в заявку*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </li>
                    ))}
                </ul>
            </div>
            {/*<div className="fixed bottom-2 right-2">*/}
            {/*    <Link to="#" className="no-underline pointer-events-none">*/}
            {/*        <div className="relative">*/}
            {/*            <img className="bg-[#FCDD9F] h-16 w-16 rounded-full shadow-lg"*/}
            {/*                 src="/basket.png"*/}
            {/*                 alt="store icon"/>*/}
            {/*            <div*/}
            {/*                className="absolute top-10 left-10 flex items-center justify-center w-6 h-6 bg-[#A67B5B] border border-white rounded-full">*/}
            {/*                <p className="font-roboto text-white font-bold text-lg">{currentCount}</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>

    )
}


export default PlayersPage;
