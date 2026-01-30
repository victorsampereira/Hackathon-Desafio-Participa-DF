import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const FormAudioPage = () => {
    const navigate = useNavigate();
    const { draft, dispatch, actions } = useManifestationDraft();

    const {
        status,
        duration,
        audioBlob,
        audioUrl,
        mimeType,
        errorMessage,
        startRecording,
        stopRecording,
        resetRecording,
        formatDuration,
        isRecording,
        hasRecording,
        hasError
    } = useAudioRecorder();

    const { minutes, seconds } = formatDuration(duration);

    // Atualiza o draft quando houver gravação
    useEffect(() => {
        if (hasRecording && audioBlob) {
            dispatch({
                type: actions.SET_AUDIO,
                payload: {
                    blob: audioBlob,
                    url: audioUrl,
                    mimeType: mimeType,
                    duration: duration,
                    recordedAt: new Date()
                }
            });
        }
    }, [hasRecording, audioBlob, audioUrl, mimeType, duration, dispatch, actions]);

    const handleContinue = () => {
        if (hasRecording) {
            navigate('/form-location');
        }
    };

    const handleSkip = () => {
        navigate('/form-location');
    };

    const handleReset = () => {
        resetRecording();
        dispatch({
            type: actions.SET_AUDIO,
            payload: {
                blob: null,
                url: null,
                mimeType: '',
                duration: 0,
                recordedAt: null
            }
        });
    };

    return (
        <Layout title="Gravação de Áudio" showNav={false}>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
                <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-3">
                    Prefere falar?
                </h1>
                <p className="text-[#111418] dark:text-gray-300 text-lg font-medium leading-normal pb-8 text-center px-2">
                    {isRecording
                        ? 'Conte o que aconteceu. Estamos gravando...'
                        : hasRecording
                            ? 'Gravação concluída! Ouça abaixo ou grave novamente.'
                            : 'Aperte o botão abaixo e conte o que aconteceu.'}
                </p>

                {/* Timer de gravação */}
                <div className="flex gap-4 py-8 px-4 w-full max-w-[280px]">
                    <div className="flex grow basis-0 flex-col items-stretch gap-2">
                        <div className="flex h-16 grow items-center justify-center rounded-xl px-3 bg-white dark:bg-gray-800 border-2 border-primary/20 shadow-sm">
                            <p className="text-[#111418] dark:text-white text-2xl font-bold leading-tight tracking-widest">
                                {minutes}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-[#111418] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                Minutos
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center pt-2">
                        <span className="text-2xl font-bold text-primary">:</span>
                    </div>
                    <div className="flex grow basis-0 flex-col items-stretch gap-2">
                        <div className="flex h-16 grow items-center justify-center rounded-xl px-3 bg-white dark:bg-gray-800 border-2 border-primary/20 shadow-sm">
                            <p className="text-[#111418] dark:text-white text-2xl font-bold leading-tight tracking-widest">
                                {seconds}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-[#111418] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                Segundos
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visualizador de ondas sonoras */}
                <div className="w-full max-w-xs h-12 flex items-center justify-center gap-1 mb-10">
                    {[0.3, 0.4, 0.5, 0.4, 0.3, 0.5, 1, 0.5, 0.3].map((op, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full bg-primary ${isRecording ? 'animate-pulse' : ''}`}
                            style={{ height: `${op * 40}px`, opacity: isRecording ? op : 0.3 }}
                        ></div>
                    ))}
                </div>

                {/* Mensagem de status para leitores de tela */}
                <div role="status" aria-live="polite" className="sr-only">
                    {isRecording && `Gravando. Duração: ${minutes} minutos e ${seconds} segundos.`}
                    {hasRecording && 'Gravação finalizada com sucesso.'}
                    {hasError && errorMessage}
                </div>

                {/* Player de áudio (só aparece quando tem gravação) */}
                {hasRecording && audioUrl && (
                    <div className="w-full max-w-md mb-8 px-4">
                        <label className="text-[#111418] dark:text-white text-sm font-medium mb-2 block">
                            Sua gravação ({duration}s)
                        </label>
                        <audio
                            controls
                            src={audioUrl}
                            className="w-full rounded-lg"
                            aria-label="Player de áudio da gravação"
                        >
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                    </div>
                )}

                {/* Mensagem de erro */}
                {hasError && (
                    <div
                        role="alert"
                        className="w-full max-w-md mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg"
                    >
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                            <div className="flex-1">
                                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botão principal de gravação */}
                {!hasRecording && (
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={hasError}
                        className="group flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
                        aria-pressed={isRecording}
                    >
                        <div
                            className={`flex items-center justify-center size-28 rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary'
                                } text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:hover:scale-100`}
                        >
                            <span className="material-symbols-outlined text-5xl fill-1">
                                {isRecording ? 'stop' : 'mic'}
                            </span>
                        </div>
                        <span className="mt-4 text-[#111418] dark:text-white text-xl font-bold tracking-wide">
                            {isRecording ? 'Parar' : 'Gravar'}
                        </span>
                    </button>
                )}

                {/* Botão de gravar novamente */}
                {hasRecording && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Descartar gravação e gravar novamente"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Gravar novamente
                    </button>
                )}
            </div>

            {/* Botões de navegação */}
            <div className="p-6 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-4 max-w-md mx-auto">
                    {hasRecording ? (
                        <>
                            <button
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent text-[#111418] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Descartar gravação"
                            >
                                <span className="material-symbols-outlined">delete</span> Limpar
                            </button>
                            <button
                                onClick={handleContinue}
                                className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                aria-label="Continuar para próxima etapa"
                            >
                                <span className="material-symbols-outlined">arrow_forward</span> Continuar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleSkip}
                            className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-transparent border-2 border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Pular gravação de áudio"
                        >
                            Pular esta etapa
                        </button>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <p className="text-xs font-medium text-[#111418] dark:text-white uppercase tracking-widest">
                        Conexão Segura - GDF
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default FormAudioPage;
