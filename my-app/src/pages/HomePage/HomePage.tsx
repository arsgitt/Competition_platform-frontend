
import Navbar from "../components/Navbar.tsx";


const HomePage =  () => {
    return (
        <div className="font-roboto w-full h-screen bg-cover bg-center bg-background flex flex-col">
            {/* Header */}
            <Navbar/>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <div className="bg-slate-400 rounded-md shadow-lg sm:w-2/5 sm:h-2/5 w-5/6 h-1/3 flex flex-col items-center justify-center text-center">
                    <h2 className="shadow-amber-400 bg-clip-text text-slate-800 text-4xl font-bold mb-4">
                        Спортивные меропрития
                    </h2>
                    <p className="text-white mb-6 max-w-md">
                        Собери команду мечты и побеждай!
                    </p>
                    {/*<div className="space-x-4">*/}
                    {/*    <Link*/}
                    {/*        to="/players"*/}
                    {/*        className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800"*/}
                    {/*    >*/}
                    {/*        Игроки*/}
                    {/*    </Link>*/}
                    {/*    <Link*/}
                    {/*        to={`#/teams`}*/}
                    {/*        className="pointer-events-none px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800"*/}
                    {/*    >*/}
                    {/*        Сформированные заявки*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                </div>
            </main>
        </div>

    );
};

export default HomePage;