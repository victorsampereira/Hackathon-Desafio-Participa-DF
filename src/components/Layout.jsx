import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = ({ children, showNav = true, title = "Ouvidoria GDF", backPath, showBack = true }) => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col h-screen max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-xl overflow-hidden">
            <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center p-4 justify-between h-14">
                    {showBack ? (
                        <button
                            onClick={() => backPath ? navigate(backPath) : navigate(-1)}
                            className="text-[#111418] dark:text-white flex size-10 shrink-0 items-center justify-center"
                            aria-label="Voltar"
                        >
                            <span className="material-symbols-outlined">arrow_back_ios</span>
                        </button>
                    ) : (
                        <div className="size-10"></div>
                    )}
                    <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate px-2">
                        {title}
                    </h2>
                    <div className="size-10"></div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar">
                {children}
            </main>

            {showNav && <BottomNav />}
        </div>
    );
};

export default Layout;
