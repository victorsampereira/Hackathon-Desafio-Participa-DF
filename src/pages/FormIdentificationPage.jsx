import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const FormIdentificationPage = () => {
    const navigate = useNavigate();
    const { draft, dispatch, actions } = useManifestationDraft();

    // Inicializa com valor do Context ou 'anonymous' por padrão
    const [idChoice, setIdChoice] = useState(draft.identification.type || 'anonymous');
    const [name, setName] = useState(draft.identification.name || '');
    const [contact, setContact] = useState(draft.identification.contact || '');

    // Sincronizar com Context quando identificação mudar
    useEffect(() => {
        dispatch({
            type: actions.SET_IDENTIFICATION,
            payload: {
                type: idChoice,
                name: idChoice === 'identified' ? name : '',
                contact: idChoice === 'identified' ? contact : ''
            }
        });
    }, [idChoice, name, contact, dispatch, actions]);

    return (
        <Layout title="Ouvidoria GDF" showNav={false}>
            <ProgressBar step={3} total={4} label="Identificação" />

            <div className="px-4 pt-8 pb-4">
                <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                    Quer se identificar?
                </h1>
            </div>

            <div className="px-4 py-2">
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-5">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                        <div className="flex flex-col gap-1">
                            <p className="text-primary text-base font-bold leading-tight">Privacidade garantida</p>
                            <p className="text-[#4b5563] dark:text-slate-300 text-[15px] font-normal leading-relaxed">
                                Você pode enviar sua manifestação sem se identificar. Isso não impede a análise por parte dos órgãos responsáveis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 flex flex-col gap-3">
                <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-slate-900 ios-shadow ${idChoice === 'anonymous' ? 'border-primary' : 'border-transparent'}`}>
                    <input
                        className="hidden"
                        type="radio"
                        name="id_choice"
                        value="anonymous"
                        onChange={() => setIdChoice('anonymous')}
                        checked={idChoice === 'anonymous'}
                    />
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                            <span className="material-symbols-outlined">visibility_off</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[#111418] dark:text-white font-bold text-base">Enviar anonimamente</span>
                            <span className="text-sm text-gray-500 dark:text-slate-400 font-normal">
                                Sua identidade será mantida em sigilo total.
                            </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${idChoice === 'anonymous' ? 'border-primary' : 'border-gray-300'}`}>
                            {idChoice === 'anonymous' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                    </div>
                </label>

                <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-slate-900 ios-shadow ${idChoice === 'identified' ? 'border-primary' : 'border-transparent'}`}>
                    <input
                        className="hidden"
                        type="radio"
                        name="id_choice"
                        value="identified"
                        onChange={() => setIdChoice('identified')}
                        checked={idChoice === 'identified'}
                    />
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined fill-1">person</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[#111418] dark:text-white font-bold text-base">Me identificar</span>
                            <span className="text-sm text-gray-500 dark:text-slate-400 font-normal">
                                Para receber atualizações e respostas oficiais.
                            </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${idChoice === 'identified' ? 'border-primary' : 'border-gray-300'}`}>
                            {idChoice === 'identified' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                    </div>
                </label>
            </div>

            {idChoice === 'identified' && (
                <div className="px-4 space-y-4 mb-8">
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">Dados de Identificação</h3>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">Nome completo</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111418] dark:text-white outline-none transition-all placeholder:text-gray-400"
                            placeholder="Como gostaria de ser chamado"
                            type="text"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">E-mail ou Telefone</label>
                        <input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111418] dark:text-white outline-none transition-all placeholder:text-gray-400"
                            placeholder="Para receber o protocolo"
                            type="text"
                        />
                    </div>
                </div>
            )}

            <div className="px-4 py-6 mt-auto">
                <div className="flex items-center gap-2 justify-center mb-6">
                    <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
                        Seus dados estão protegidos sob a LGPD e serão tratados com sigilo.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/review')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                    Continuar <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </Layout>
    );
};

export default FormIdentificationPage;

