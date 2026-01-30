import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const FormTextPage = () => {
    const navigate = useNavigate();
    const { draft, dispatch, actions } = useManifestationDraft();
    const [text, setText] = useState(draft.text || '');

    // Sincronizar com Context quando texto mudar
    useEffect(() => {
        dispatch({ type: actions.SET_TEXT, payload: text });
    }, [text, dispatch, actions]);

    const maxChars = 2000;
    const charCount = text.length;

    return (
        <Layout title="Manifestação" showNav={false}>
            <ProgressBar step={1} total={4} label="Descrição" />

            <div className="px-4 pt-4 pb-1">
                <h3 className="text-[#111418] dark:text-white tracking-tight text-2xl font-bold leading-tight">
                    Conte com suas palavras o que aconteceu
                </h3>
            </div>

            <div className="px-4">
                <p className="text-[#617589] dark:text-[#9eaebc] text-base font-normal leading-relaxed pb-4">
                    Sua descrição ajuda o governo a identificar e resolver o problema de forma mais rápida.
                </p>
            </div>

            <div className="flex flex-col gap-4 px-4 py-2">
                <label className="flex flex-col">
                    <div className="flex justify-between items-center pb-2">
                        <span className="text-[#111418] dark:text-white text-sm font-medium">
                            Descrição da manifestação
                        </span>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={maxChars}
                        className="form-input flex w-full min-w-0 resize-none rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dbe0e6] dark:border-[#2e363d] bg-white dark:bg-[#1a2128] focus:border-primary min-h-[250px] placeholder:text-[#617589] p-4 text-base font-normal leading-normal transition-shadow"
                        placeholder="Exemplo: Tive um problema no atendimento de saúde no Hospital de Base..."
                    ></textarea>
                    <div className="pt-2 text-right">
                        <span className="text-[#617589] text-xs">{charCount} / {maxChars} caracteres</span>
                    </div>
                </label>
            </div>

            <div className="p-4 mt-auto">
                <button
                    onClick={() => navigate('/form-location')}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                    <span>Próximo</span>
                </button>
            </div>
        </Layout>
    );
};

export default FormTextPage;

