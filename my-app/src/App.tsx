
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx'
import PlayersPage from './pages/PlayersPage/PlayersPage.tsx'
import PlayerDescriptionPage from "./pages/PlayerPage/PlayerPage.tsx";

function App() {

    return (
        <div className="wrapper">

            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/players" element={<PlayersPage/>} />
                <Route path="/players/:playerId" element={<PlayerDescriptionPage/>}/>

            </Routes>

        </div>
    )
}


export default App