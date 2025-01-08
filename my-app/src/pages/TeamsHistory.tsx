// TeamsHistoryPage.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import BreadCrumbs from "./components/BreadCrumbs";
import { fetchTeams } from '../redux/teamSlice';

const TeamsHistoryPage = () => {
    const dispatch = useDispatch();
    const { teams, status, error } = useSelector((state) => state.team);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const statusteams = {
        formed: 'Сформирована',
        completed: 'Завершена',
        draft: 'Черновик',
        deleted: 'Удалена'
    };

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchTeams());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <BreadCrumbs path="/teams" />

            <div className="container mx-auto mt-10 px-4">
                <h2 className="text-2xl font-semibold mb-4">Мои заявки команд</h2>

                {status === "loading" ? (
                    <div className="flex justify-center items-center h-72">
                        <div
                            className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500 text-white p-4 rounded">{error}</div>
                ) : (
                    <div className="space-y-4">
                        {teams
                            .filter(team => team.status === 'formed' || team.status === 'completed')
                            .map((team) => (
                                <div
                                    key={team.pk}
                                    className="bg-slate-600 text-gray-300 rounded p-4 shadow-md hover:bg-[#333A4E] transition"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center">
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Номер заявки</span>
                                            {team.pk || '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Команда</span>
                                            {team.name_team || '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Турнир</span>
                                            {team.competition || '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Статус</span>
                                            {statusteams[team.status] || '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Смодерирована</span>
                                            {team.updated_at != null
                                                ? new Date(team.updated_at).toLocaleDateString('ru-RU')
                                                : '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Завершена</span>
                                            {team.completed_at != null
                                                ? new Date(team.completed_at).toLocaleDateString('ru-RU')
                                                : '-'}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
                                            <span className="font-semibold block">Создатель</span>
                                            {team.username || '-'}
                                        </div>
                                        <div className="text-center mt-0">
                                            <span className="font-semibold block">Болельщики</span>
                                            {team.count_fans != null ? team.count_fans : ''}
                                        </div>
                                        <div className="text-center h-full flex flex-col justify-center">
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
