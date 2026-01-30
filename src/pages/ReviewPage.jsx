import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const ReviewPage = () => {
    const navigate = useNavigate();
    const { draft, submit, isSubmitting, isError, submitError, resetSubmit } = useManifestationDraft();

    const handleSubmit = async () => {
        try {
            await submit();
            // Sucesso - navegar para página de sucesso
            navigate('/success');
        } catch (error) {
            // Erro já está no estado, não precisa fazer nada aqui
            console.error('Erro ao enviar:', error);
        }
    };

    const handleRetry = () => {
        resetSubmit();
    };

    const handleEdit = () => {
        resetSubmit();
        navigate('/form-text');
    };

    return (
        <Layout title="Confira sua manifestação" showNav={false}>
            <ProgressBar step={4} total={4} label="Revisão Final" />

            {/* Alert de erro */}
            {isError && submitError && (
                <div
                    role="alert"
                    className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg"
                >
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                        <div className="flex-1">
                            <p className="text-red-800 dark:text-red-200 font-medium mb-3">
                                {submitError.message}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                                    aria-label="Tentar enviar novamente"
                                >
                                    Tentar novamente
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-transparent border border-red-600 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                    aria-label="Voltar e editar manifestação"
                                >
                                    Voltar e editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-[#1c2632] mb-2">
                <h3 className="text-[#111418] dark:text-white tracking-tight text-2xl font-bold leading-tight px-4 pb-4 pt-6">
                    Resumo da Manifestação
                </h3>
            </div>

            {/* Conteúdo textual */}
            {draft.text && (
                <div className="bg-white dark:bg-[#1c2632] mb-2 border-b border-gray-100 dark:border-[#2d3a4a]">
                    <div className="flex items-center gap-2 px-4 pt-4 text-primary">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                        <h3 className="text-[#111418] dark:text-white text-sm font-bold uppercase">Descrição do Relato</h3>
                    </div>
                    <p className="text-[#4f6171] dark:text-gray-400 text-base font-normal leading-relaxed pb-6 pt-2 px-4">
                        {draft.text}
                    </p>
                </div>
            )}

            {/* Áudio */}
            {draft.audio.blob && (
                <div className="bg-white dark:bg-[#1c2632] mb-2 border-b border-gray-100 dark:border-[#2d3a4a]">
                    <div className="flex items-center gap-2 px-4 pt-4 text-primary">
                        <span className="material-symbols-outlined text-[20px]">mic</span>
                        <h3 className="text-[#111418] dark:text-white text-sm font-bold uppercase">Áudio Gravado</h3>
                    </div>
                    <div className="px-4 py-4">
                        <audio controls src={draft.audio.url} className="w-full">
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                        <p className="text-xs text-gray-500 mt-2">
                            Duração: {Math.floor(draft.audio.duration / 60)}:{(draft.audio.duration % 60).toString().padStart(2, '0')}
                        </p>
                    </div>
                </div>
            )}

            {/* Mídia (imagem/vídeo) */}
            {(draft.media.image.file || draft.media.video.file) && (
                <div className="bg-white dark:bg-[#1c2632] mb-2 p-4">
                    <div className="flex items-center gap-2 text-primary mb-3">
                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                        <h3 className="text-[#111418] dark:text-white text-sm font-bold uppercase">
                            Arquivos ({[draft.media.image.file, draft.media.video.file].filter(Boolean).length})
                        </h3>
                    </div>
                    <div className="flex gap-3">
                        {draft.media.image.file && (
                            <div className="w-24">
                                <div className="h-24 bg-gray-100 dark:bg-[#2d3a4a] rounded-lg mb-1 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={draft.media.image.previewUrl}
                                        alt="Imagem anexada"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 truncate">{draft.media.image.name}</p>
                            </div>
                        )}
                        {draft.media.video.file && (
                            <div className="w-24">
                                <div className="h-24 bg-gray-100 dark:bg-[#2d3a4a] rounded-lg mb-1 overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl text-gray-400">videocam</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{draft.media.video.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Localização */}
            {draft.location.address && (
                <div className="bg-white dark:bg-[#1c2632] mb-2 p-4">
                    <div className="flex items-center gap-2 text-primary mb-3">
                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                        <h3 className="text-[#111418] dark:text-white text-sm font-bold uppercase">Localização</h3>
                    </div>
                    <p className="text-[#111418] dark:text-white text-base font-medium">
                        {draft.location.address}
                    </p>
                </div>
            )}

            {/* Identificação */}
            <div className="bg-white dark:bg-[#1c2632] mb-2 p-4">
                <div className="flex items-center gap-2 text-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                        {draft.identification.type === 'anonymous' ? 'visibility_off' : 'person'}
                    </span>
                    <h3 className="text-[#111418] dark:text-white text-sm font-bold uppercase">Identificação</h3>
                </div>
                {draft.identification.type === 'anonymous' ? (
                    <p className="text-[#4f6171] dark:text-gray-400 text-sm">
                        Manifestação anônima
                    </p>
                ) : (
                    <div className="space-y-2">
                        {draft.identification.name && (
                            <p className="text-[#111418] dark:text-white text-sm">
                                <span className="font-medium">Nome:</span> {draft.identification.name}
                            </p>
                        )}
                        {draft.identification.contact && (
                            <p className="text-[#111418] dark:text-white text-sm">
                                <span className="font-medium">Contato:</span> {draft.identification.contact}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Botões de ação */}
            <div className="p-4 grid grid-cols-2 gap-4 mt-8 pb-32" aria-busy={isSubmitting}>
                <button
                    onClick={handleEdit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center h-12 rounded-xl border border-primary text-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
                    aria-label="Editar manifestação"
                >
                    <span className="material-symbols-outlined mr-2">edit</span> Editar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors relative"
                    aria-label={isSubmitting ? "Enviando manifestação" : "Enviar manifestação"}
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Enviando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined mr-2">send</span> Enviar
                        </>
                    )}
                </button>
                <p className="col-span-2 text-[10px] text-center text-[#4f6171] dark:text-gray-400">
                    Ao clicar em enviar, você confirma que as informações são verdadeiras.
                </p>
            </div>
        </Layout>
    );
};

export default ReviewPage;
