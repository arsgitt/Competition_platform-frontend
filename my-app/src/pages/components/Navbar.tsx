import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="text-black py-4 px-6 flex justify-between items-center font-roboto">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-12 h-12">
                        <img src="/logo.webp" alt="logo"/>
                    </div>
                    <p className="hover:text-gray-300 transition-all duration-500">Спортивные соревнования</p>
                </Link>
            </div>
            {/* Links */}
            <nav className="space-x-4">
                <Link to="/players" className="font-semibold hover:text-gray-300 transition-all duration-500">
                    Игроки
                </Link>
                <Link to="#teams" className="pointer-events-none font-semibold hover:text-gray-300">
                    Заявки
                </Link>
            </nav>
        </header>
    );
};

export default Navbar;