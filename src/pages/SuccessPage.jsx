import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import IZAClassificationCard from '../components/IZAClassificationCard';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const SuccessPage = () => {
    const navigate = useNavigate();
    const { submitResult, izaClassification, actions, dispatch } = useManifestationDraft();
    const [copied, setCopied] = useState(false);

    const protocol = submitResult?.protocol || 'DF-2026-00000';

    /**
     * Copia protocolo para área de transferência
     */
    const handleCopyProtocol = async () => {
        try {
            // Tenta usar Clipboard API (moderna)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(protocol);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            } else {
                // Fallback para navegadores antigos
                const textArea = document.createElement('textarea');
                textArea.value = protocol;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                } catch (err) {
                    console.error('Erro ao copiar:', err);
                }
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Erro ao copiar protocolo:', err);
        }
    };

    /**
     * Volta ao início e reseta manifestação
     */
    const handleBackToHome = () => {
        dispatch({ type: actions.RESET });
        navigate('/welcome');
    };

    return (
        <Layout title="Manifestação Enviada" showNav={false}>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
                {/* Ícone de sucesso */}
                <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full mb-6">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-6xl fill-1">
                        check_circle
                    </span>
                </div>

                {/* Título */}
                <h1 className="text-[#111418] dark:text-white text-3xl font-bold text-center mb-3">
                    Manifestação registrada com sucesso
                </h1>

                {/* Subtítulo */}
                <p className="text-[#4f6171] dark:text-gray-400 text-base text-center mb-8 max-w-md">
                    Sua manifestação foi recebida e será analisada pela equipe responsável do Governo do Distrito Federal.
                </p>

                {/* Card do protocolo */}
                <div className="w-full max-w-md bg-white dark:bg-[#1c2632] rounded-xl border-2 border-primary/20 p-6 mb-8">
                    <div className="text-center mb-4">
                        <p className="text-[#4f6171] dark:text-gray-400 text-sm font-medium mb-2">
                            Número do Protocolo
                        </p>
                        <p className="text-primary text-4xl font-bold tracking-wider mb-1">
                            {protocol}
                        </p>
                        <p className="text-[#4f6171] dark:text-gray-400 text-xs">
                            Guarde este número para acompanhar sua manifestação.
                        </p>
                    </div>

                    {/* Botão copiar */}
                    <button
                        onClick={handleCopyProtocol}
                        className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                        aria-label={copied ? "Protocolo copiado" : "Copiar número do protocolo"}
                    >
                        <span className="material-symbols-outlined">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                        {copied ? 'Copiado!' : 'Copiar Protocolo'}
                    </button>
                </div>

                {/* Classificação IZA */}
                {izaClassification && (
                    <div className="mb-8">
                        <IZAClassificationCard classification={izaClassification} />
                    </div>
                )}

                {/* Status e informações adicionais */}
                <div className="w-full max-w-md space-y-4 mb-8">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
                        <div className="flex-1">
                            <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-1">
                                Status: RECEBIDA
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 text-xs">
                                Sua manifestação está na fila para análise. Você receberá atualizações conforme o andamento.
                            </p>
                        </div>
                    </div>

                    {submitResult?.attachments && submitResult.attachments.length > 0 && (
                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 mt-0.5">attach_file</span>
                            <div className="flex-1">
                                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-1">
                                    Anexos ({submitResult.attachments.length})
                                </p>
                                <div className="space-y-1">
                                    {submitResult.attachments.map((attachment) => (
                                        <p key={attachment.id} className="text-gray-600 dark:text-gray-400 text-xs">
                                            • {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mensagem de confirmação */}
                <div className="w-full max-w-md text-center mb-8">
                    <p className="text-[#4f6171] dark:text-gray-400 text-sm">
                        Obrigado por contribuir para melhorar o Distrito Federal!
                    </p>
                </div>

                {/* Botão voltar ao início */}
                <button
                    onClick={handleBackToHome}
                    className="w-full max-w-md flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
                    aria-label="Voltar ao início"
                >
                    <span className="material-symbols-outlined">home</span>
                    Voltar ao Início
                </button>
            </div>

            {/* Informações de suporte */}
            <div className="p-6 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <p className="text-xs font-medium text-[#111418] dark:text-white uppercase tracking-widest">
                        Conexão Segura - GDF
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default SuccessPage;
