import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';

const FormLocationPage = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Ouvidoria GDF" showNav={false}>
            <ProgressBar step={2} total={4} label="Localização" />

            <section className="px-4 pt-8 pb-2">
                <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                    Onde isso aconteceu?
                </h1>
            </section>

            <section className="px-4 pb-6">
                <p className="text-[#4f5b6b] dark:text-gray-400 text-base font-normal leading-relaxed">
                    Se souber, informe o local. Você pode pular esta etapa caso não possua essa informação.
                </p>
            </section>

            <div className="px-4 mb-4">
                <div className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                    <img
                        alt="Mapa"
                        className="w-full h-full object-cover opacity-60 dark:opacity-40"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDys2N2ik0WDE1ImtNxpRsjEKodFjVGhQWSIeOWgvwjSPMRVFvNCjPDWnkeUrUAZYPlbqUeC8IqixSw8l55P_oZRdWMCIpdMPSWbFQE9uLCcbEPslMrkeB3EDFrdMB0i4UII9i2ql5Ve3xoiXw1ptOrAu9pJfjS-eC-H2trsrIh0MPoKOUMW7XL80s5y-GmPrBtX0bbmYhLI37Sk15s_XXM2XSx_8yGGrZ3zzhaex04Y8RJpU_jqIhtkXPCpGNjKP52vOzb9DO4UiI"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-primary text-3xl fill-1">location_on</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="px-4 py-3">
                <label className="flex flex-col w-full">
                    <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                        Local da ocorrência
                    </p>
                    <div className="flex w-full items-stretch rounded-lg group">
                        <input
                            className="form-input flex w-full min-w-0 resize-none rounded-lg rounded-r-none border-r-0 text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal"
                            placeholder="Endereço, ponto de referência ou CEP"
                            type="text"
                        />
                        <div className="text-[#617589] flex border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center pr-[15px] rounded-r-lg border-l-0">
                            <span className="material-symbols-outlined">map</span>
                        </div>
                    </div>
                </label>
                <p className="text-xs text-[#617589] mt-2 px-1">
                    Ex: Eixo Monumental, próximo ao Palácio do Buriti
                </p>
            </section>

            <footer className="mt-auto pb-10 px-4 pt-4 flex flex-col gap-3">
                <button
                    onClick={() => navigate('/form-id')}
                    className="flex items-center justify-center rounded-lg h-14 bg-primary text-white font-bold w-full shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                >
                    Continuar
                </button>
                <button
                    onClick={() => navigate('/form-id')}
                    className="flex items-center justify-center rounded-lg h-12 bg-transparent text-[#111418] dark:text-white font-bold w-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                >
                    Pular esta etapa
                </button>
            </footer>
        </Layout>
    );
};

export default FormLocationPage;
