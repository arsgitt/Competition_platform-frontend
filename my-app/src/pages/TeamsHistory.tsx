import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { api } from '../api';
import BreadCrumbs from "./components/BreadCrumbs";

const TeamsHistoryPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useSelector((state) => state.auth);

    const fetchTeams = async () => {
        if (isAuthenticated) {
            setLoading(true);
            setError('');
            try {
                const response = await api.listTeams.listTeamsList();
                setTeams(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
                setError('Ошибка при загрузке заявок');
            } finally {
                setLoading(false);
            }
        }
    };
    const statusteams = {
        formed: 'Сформирована',
        completed: 'Завершена',
        draft: 'Черновик',
        deleted: 'Удалена'
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <BreadCrumbs path="/teams" />

            <div className="container mx-auto mt-10 px-4">
                <h2 className="text-2xl font-semibold mb-4">Мои заявки игроков</h2>

                {loading ? (
                    <div className="flex justify-center items-center h-72">
                        <div
                            className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500 text-white p-4 rounded">{error}</div>
                ) : (
                    <div className="space-y-4">
                        {teams.map((team) => (
                            <div
                                key={team.pk}
                                className="bg-slate-600 text-gray-300 rounded p-4 shadow-md hover:bg-[#333A4E] transition"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                                    <div className="text-center">
                                        <span className="font-semibold block">Номер заявки</span>
                                        {team.pk}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold block">Статус</span>
                                        {statusteams[team.status]}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold block">Смодерирована</span>
                                        {team.updated_at != null
                                            ? new Date(team.updated_at).toLocaleDateString('ru-RU')
                                            : '-'}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold block">Дата завершения</span>
                                        {team.completed_at != null
                                            ? new Date(team.completed_at).toLocaleDateString('ru-RU')
                                            : '-'}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold block">Создатель</span>
                                        {team.username}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-semibold block">Болельщики</span>
                                        {team.count_fans}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <Link
                                            to={`/team/${team.pk}`}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Просмотр
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamsHistoryPage;
//coments