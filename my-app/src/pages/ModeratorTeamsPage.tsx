import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import BreadCrumbs from './components/BreadCrumbs';

const ModeratorTeamsPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [creator, setCreator] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        const fetchTeams = async () => {
            try {
                const response = await axios.get('/api/list-teams/');
                setTeams(response.data);
            } catch (err) {
                console.error('Error fetching teams:', err);
                if (err.response?.status === 403) {
                    navigate('/403');
                } else if (err.response?.status === 404) {
                    navigate('/404');
                } else {
                    setError('Failed to load teams');
                }
            }
        };

        fetchTeams();
        intervalId = setInterval(fetchTeams, 2000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    useEffect(() => {
        const filterTeams = () => {
            const filtered = teams.filter((team) => {
                const teamDate = new Date(team.updated_at).toISOString().split('T')[0]; // Приводим к ISO формату и извлекаем дату

                const matchStartDate = startDate ? teamDate >= new Date(startDate).toISOString().split('T')[0] : true;
                const matchEndDate = endDate ? teamDate <= new Date(endDate).toISOString().split('T')[0] : true;
                const matchStatus = status ? team.status === status : team.status !== 'deleted' && team.status !== 'draft'; // Исключаем 'deleted' и 'draft'
                const matchCreator = creator ? team.username.toLowerCase().includes(creator.toLowerCase()) : true;

                return matchStartDate && matchEndDate && matchStatus && matchCreator;
            });

            setFilteredTeams(filtered);
        };

        filterTeams();
    }, [startDate, endDate, status, creator, teams]);



    const handleViewTeam = (teamId) => {
        navigate(`/team/${teamId}`);
    };

    const handleStatusChange = async (teamId) => {
        try {
            await axios.put(`/api/moderate-team/${teamId}/`, { accept: true }, {
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
            });
            const response = await axios.get('/api/list-teams/');
            setTeams(response.data);
        } catch (err) {
            console.error('Error updating team status:', err);
            if (err.response?.status === 403) {
                navigate('/403');
            } else if (err.response?.status === 404) {
                navigate('/404');
            } else {
                setError('Failed to update team status');
            }
        }
    };

    const handleRejectTeam = async (teamId) => {
        try {
            await axios.put(`/api/moderate-team/${teamId}/`, { accept: false }, {
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
            });
            const response = await axios.get('/api/list-teams/');
            setTeams(response.data);
        } catch (err) {
            console.error('Error rejecting team:', err);
            if (err.response?.status === 403) {
                navigate('/403');
            } else if (err.response?.status === 404) {
                navigate('/404');
            } else {
                setError('Failed to reject team');
            }
        }
    };

    const statusLabels = {
        formed: 'Сформирована',
        completed: 'Завершена',
        cancelled: 'Отменена',
    };

    return (
        <div className="min-h-screen bg-white font-roboto">
            <Navbar />
            <BreadCrumbs path="/manage_teams" />
            <div className="container mx-auto px-6 py-8">
                <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium mb-2 text-gray-700">Дата начала</label>
                        <input
                            type="date"
                            id="startDate"
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium mb-2 text-gray-700">Дата окончания</label>
                        <input
                            type="date"
                            id="endDate"
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-2 text-gray-700">Статус</label>
                        <select
                            id="status"
                            className="w-full h-11 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Выбери статус</option>
                            <option value="formed">Сформирована</option>
                            <option value="completed">Завершена</option>
                            <option value="cancelled">Отменена</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="creator" className="block text-sm font-medium mb-2 text-gray-700">Создатель</label>
                        <input
                            type="text"
                            id="creator"
                            className="w-full h-11 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                            placeholder="Search by creator"
                            value={creator}
                            onChange={(e) => setCreator(e.target.value)}
                        />
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div
                            className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full"
                            role="status"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-200 shadow-md">
                            <thead>
                            <tr className="bg-gray-100 text-gray-800">
                                <th className="px-4 py-2 border border-gray-200">Код команды</th>
                                <th className="px-4 py-2 border border-gray-200">Создатель</th>
                                <th className="px-4 py-2 border border-gray-200">Дата</th>
                                <th className="px-4 py-2 border border-gray-200">Статус</th>
                                <th className="px-4 py-2 border border-gray-200">Болельщики</th>
                                <th className="px-4 py-2 border border-gray-200">Модератор</th>
                                <th className="px-4 py-2 border border-gray-200">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTeams.map((team) => (
                                <tr key={team.pk} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{team.pk}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{team.username}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{new Date(team.updated_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{statusLabels[team.status] || team.status}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{team.count_fans }</td>
                                    <td className="px-4 py-2 border border-gray-200 text-gray-700">{team.moderator || 'N/A'}</td>
                                    <td className="px-4 py-2 border border-gray-200 flex space-x-2">
                                        <button
                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => handleViewTeam(team.pk)}
                                        >
                                            Посмотреть
                                        </button>
                                        {team.status === 'formed' && (
                                            <>
                                                <button
                                                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                    onClick={() => handleStatusChange(team.pk, 'ended')}
                                                >
                                                    Завершить
                                                </button>
                                                <button
                                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                    onClick={() => handleRejectTeam(team.pk)}
                                                >
                                                    Отменить
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModeratorTeamsPage;
