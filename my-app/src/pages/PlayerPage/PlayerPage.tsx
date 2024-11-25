import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Navbar from "../components/Navbar.tsx";
import BreadCrumbs from "../components/BreadCrumbs.tsx";
// import BreadCrumbs from "./components/BreadCrumbs.tsx";
import PALMER from '../../assets/palmer.webp';
import JACKSON from '../../assets/jackson.webp';
import JAMES from '../../assets/james.webp';
import  defaultImageUrl from '../../assets/npc.png';

interface Player {
    id: number;
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

const mockPlayers: Player[] = [
    { id: 1, f_name: 'PALMER', l_name: 'COLE', date_birthday: '01-01-2000', birth_place: 'Тушино', weight: '60',
        height: '177', position: 'MIDFIELDER', image_player_url: PALMER, number: '20'},
    { id: 2, f_name: 'JAMES', l_name: 'REECE', date_birthday: '02-01-2000', birth_place: 'Тушино', weight: '80',
        height: '172', position: 'DEFENDER', image_player_url: JAMES, number: '24'},
    { id: 3, f_name: 'JACKSON', l_name: 'NICOLAS', date_birthday: '03-01-2000', birth_place: 'Тушино', weight: '75',
        height: '185', position: 'FORWARD', image_player_url: JACKSON, number: '15'},
];


const PlayerDescriptionPage = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true); // Для отображения состояния загрузки
    const [error, setError] = useState(""); // Для обработки ошибок

    const fetchPlayer = async () => {
        try {
            const response = await fetch(`http://localhost:8000/players/${playerId}/`);

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const playerData = await response.json();
            setPlayer(playerData);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // Если произошла ошибка, используем мок-данные
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
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
            <BreadCrumbs path={`/players/${player?.l_name}`}/>
            <div className="container mx-auto p-4">
                <div className="space-y-6 md:space-y-10">
                    {/* Number and Name Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                        <div className="font-arsik2 text-5xl md:text-9xl font-bold mr-0 md:mr-4">{player?.number}</div>
                        <div className="text-center md:text-left mt-2 md:mt-5">
                            <div className="text-2xl md:text-3xl font-semibold">{player?.l_name}</div>
                            <div className="text-3xl md:text-5xl font-semibold">{player?.f_name}</div>
                        </div>
                    </div>

                    {/* Photo Section */}
                    <div className="w-full md:w-1/3 mx-auto md:mx-0 bg-[#0A1A55] border rounded h-70 sm:h-auto">
                        <img src={player?.image_player_url || defaultImageUrl} alt={player?.f_name}
                             className="rounded-md w-full h-50 sm:h-52 md:h-72 object-cover"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="ml-5">
                                <div className="text-[#767676] font-bold text-2xl">Позиция</div>
                                <div className="text-white text-2xl">{player?.position}</div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="bg-gray-200 p-4 rounded-md border border-gray-400">
                        <div className="grid grid-cols-4 gap-4 mb-2 border-b border-gray-400 pb-2 text-sm">
                            <div className="font-semibold text-center px-2">Рост</div>
                            <div className="font-semibold text-center px-2">Вес</div>
                            <div className="font-semibold text-center px-2">Место рождения</div>
                            <div className="font-semibold text-center">Дата рождения</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="text-center px-2">{player?.height} см</div>
                            <div className="text-center px-2">{player?.weight} кг</div>
                            <div className="text-center px-2">{player?.birth_place}</div>
                            <div className="text-center">{player?.date_birthday}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default PlayerDescriptionPage;