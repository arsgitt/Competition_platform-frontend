
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx'
import PlayersPage from './pages/PlayersPage/PlayersPage.tsx'
import PlayerDescriptionPage from "./pages/PlayerPage/PlayerPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import TeamsHistoryPage from "./pages/TeamsHistory.tsx";
import ModeratorPlayersPage from "./pages/ModeratorPlayersPage.tsx";
import ModeratorTeamsPage from "./pages/ModeratorTeamsPage.tsx";
import PlayerFormPage from "./pages/PlayerFormPage.tsx";
import Page403 from "./pages/Page403.tsx";
import Page404 from "./pages/Page404.tsx";
// import {useEffect} from "react";


function App() {

    // useEffect(() => {
    //     // Check if we're in a Tauri environment
    //     if (window.TAURI) {
    //         const { invoke } = window.TAURI.tauri;
    //
    //         invoke('tauri', { cmd: 'create' })
    //             .then((response: any) => console.log(response))
    //             .catch((error: any) => console.log(error));
    //
    //         return () => {
    //             invoke('tauri', { cmd: 'close' })
    //                 .then((response: any) => console.log(response))
    //                 .catch((error: any) => console.log(error));
    //         };
    //     }
    // }, []);
    return (
        <BrowserRouter basename="/Competition_platform-frontend"> {/* RepoName - название вашего репозитория */}
        {/*<div className="wrapper">*/}
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/players" element={<PlayersPage/>} />
                <Route path="/players/:playerId" element={<PlayerDescriptionPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/team/:teamId" element={<TeamPage/>}/>
                <Route path="/teams" element={<TeamsHistoryPage/>}/>
                <Route path="/manage-players" element={<ModeratorPlayersPage/>} />
                <Route path="/manage-teams" element={<ModeratorTeamsPage/>} />
                <Route path="/manage-players/edit/:id" element={<PlayerFormPage/>}/>
                <Route path="/manage-players/new" element={<PlayerFormPage/>}/>
                <Route path="/403" element={<Page403/>}/>
                <Route path="/404" element={<Page404/>}/>
            </Routes>

        {/*</div>*/}
        </BrowserRouter>
    )
}


export default App