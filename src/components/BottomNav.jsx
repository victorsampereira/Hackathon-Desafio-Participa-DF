import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: 'home', label: 'Início', path: '/welcome' },
        { icon: 'description', label: 'Manifestações', path: '#' },
        { icon: 'notifications', label: 'Avisos', path: '#' },
        { icon: 'person', label: 'Perfil', path: '#' },
    ];

    return (
        <nav className="bg-white dark:bg-background-dark border-t border-[#f0f2f4] dark:border-gray-800 pb-safe">
            <div className="flex px-4 pb-4 pt-2">
                {navItems.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.path}
                        className={`flex flex-1 flex-col items-center justify-center gap-1 ${location.pathname === item.path ? 'text-primary' : 'text-[#617589]'
                            }`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <p className="text-[10px] font-bold leading-normal tracking-[0.015em]">
                            {item.label}
                        </p>
                    </Link>
                ))}
            </div>
            <div className="h-1.5 w-32 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-2 shrink-0"></div>
        </nav>
    );
};

export default BottomNav;
