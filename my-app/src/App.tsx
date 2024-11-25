
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx'
import PlayersPage from './pages/PlayersPage/PlayersPage.tsx'
import PlayerDescriptionPage from "./pages/PlayerPage/PlayerPage.tsx";
import {useEffect} from "react";


function App() {

    useEffect(() => {
        // Check if we're in a Tauri environment
        if (window.TAURI) {
            const { invoke } = window.TAURI.tauri;

            invoke('tauri', { cmd: 'create' })
                .then((response: any) => console.log(response))
                .catch((error: any) => console.log(error));

            return () => {
                invoke('tauri', { cmd: 'close' })
                    .then((response: any) => console.log(response))
                    .catch((error: any) => console.log(error));
            };
        }
    }, []);
    return (
        <BrowserRouter basename="/Competition_platform-frontend"> {/* RepoName - название вашего репозитория */}
        {/*<div className="wrapper">*/}
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/players" element={<PlayersPage/>} />
                <Route path="/players/:playerId" element={<PlayerDescriptionPage/>}/>

            </Routes>

        {/*</div>*/}
        </BrowserRouter>
    )
}


export default App