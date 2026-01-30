import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate('/welcome'), 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="flex flex-col items-center text-center max-w-xs transition-all">
                <div className="mb-8 p-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[64px] fill-1">account_balance</span>
                </div>
                <h1 className="text-[#111418] dark:text-white tracking-tight text-[36px] font-bold leading-tight pb-3">
                    Participa Fácil
                </h1>
                <p className="text-[#4b5563] dark:text-gray-400 text-lg font-normal leading-relaxed">
                    Uma forma simples e acessível de falar com o Governo.
                </p>
            </div>

            <div className="absolute bottom-12 w-full px-8 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center opacity-60">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#111418] dark:text-white mb-2">
                        Governo do Distrito Federal
                    </p>
                    <div className="h-[1px] w-12 bg-primary"></div>
                </div>

                <div className="absolute bottom-4 right-8 flex flex-col items-center gap-1 group">
                    <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px] font-bold">accessibility_new</span>
                    </div>
                    <span className="text-[10px] font-medium text-primary uppercase tracking-tighter">
                        Acessível
                    </span>
                </div>
            </div>

            <div className="absolute bottom-2 w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
    );
};

export default SplashPage;
