import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook customizado para gravação de áudio usando MediaRecorder API
 * 
 * Funcionalidades:
 * - Gravação de áudio com limite de 2 minutos
 * - Detecção automática de formato suportado (webm > mp4 > ogg)
 * - Tratamento robusto de erros e permissões
 * - Cleanup automático de recursos
 * - Acessibilidade WCAG 2.1 AA
 * 
 * @returns {Object} Estado e funções para controle de gravação
 */
const useAudioRecorder = () => {
    // Estados principais
    const [status, setStatus] = useState('idle'); // idle | recording | stopped | error
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [mimeType, setMimeType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Refs para controle interno
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // Constantes
    const MAX_DURATION = 120; // 2 minutos em segundos

    /**
     * Detecta o formato de áudio mais adequado suportado pelo navegador
     * Prioridade: webm > mp4 > ogg
     */
    const getSupportedMimeType = useCallback(() => {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus',
            'audio/ogg'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return ''; // Nenhum formato suportado
    }, []);

    /**
     * Inicia a gravação de áudio
     * Solicita permissão do microfone e configura MediaRecorder
     */
    const startRecording = useCallback(async () => {
        try {
            // Verifica suporte do navegador
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setStatus('error');
                setErrorMessage('Este navegador não oferece suporte à gravação de áudio. Você pode registrar por texto ou anexar um vídeo.');
                return;
            }

            // Detecta formato suportado
            const supportedMimeType = getSupportedMimeType();
            if (!supportedMimeType) {
                setStatus('error');
                setErrorMessage('Seu navegador não suporta os formatos de áudio necessários. Recomendamos usar Chrome, Edge ou Firefox atualizado.');
                return;
            }

            // Solicita acesso ao microfone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            mediaStreamRef.current = stream;

            // Configura MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: supportedMimeType
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // Event listeners
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: supportedMimeType });
                const url = URL.createObjectURL(blob);

                setAudioBlob(blob);
                setAudioUrl(url);
                setMimeType(supportedMimeType);
                setStatus('stopped');

                // Para o timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                setStatus('error');
                setErrorMessage('Ocorreu um erro durante a gravação. Por favor, tente novamente.');
                stopRecording();
            };

            // Inicia gravação
            mediaRecorder.start(100); // Coleta chunks a cada 100ms
            setStatus('recording');
            setDuration(0);
            setMimeType(supportedMimeType);
            setErrorMessage('');

            // Inicia timer
            timerRef.current = setInterval(() => {
                setDuration((prev) => {
                    const newDuration = prev + 1;

                    // Para automaticamente ao atingir 2 minutos
                    if (newDuration >= MAX_DURATION) {
                        stopRecording();
                        setErrorMessage('Gravação atingiu o limite de 2 minutos e foi finalizada automaticamente.');
                    }

                    return newDuration;
                });
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);

            // Mensagens específicas por tipo de erro
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setErrorMessage('Precisamos de permissão para usar o microfone. Por favor, permita o acesso nas configurações do navegador.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                setErrorMessage('Não foi possível detectar um microfone. Verifique se está conectado corretamente.');
            } else {
                setErrorMessage('Ocorreu um erro ao acessar o microfone. Por favor, tente novamente.');
            }

            setStatus('error');
        }
    }, [getSupportedMimeType]);

    /**
     * Para a gravação em andamento
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        // Para o timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Para e libera tracks do microfone
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
    }, []);

    /**
     * Reseta a gravação, limpando todos os dados
     */
    const resetRecording = useCallback(() => {
        // Revoga URL do áudio anterior para liberar memória
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        // Para gravação se estiver ativa
        if (status === 'recording') {
            stopRecording();
        }

        // Limpa estados
        setStatus('idle');
        setDuration(0);
        setAudioBlob(null);
        setAudioUrl(null);
        setMimeType('');
        setErrorMessage('');
        chunksRef.current = [];
    }, [audioUrl, status, stopRecording]);

    /**
     * Cleanup ao desmontar componente
     * Garante que recursos sejam liberados
     */
    useEffect(() => {
        return () => {
            // Para gravação se estiver ativa
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }

            // Para timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Libera tracks do microfone
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }

            // Revoga object URL
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    /**
     * Formata duração em mm:ss
     */
    const formatDuration = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            minutes: mins.toString().padStart(2, '0'),
            seconds: secs.toString().padStart(2, '0')
        };
    }, []);

    return {
        // Estados
        status,
        duration,
        audioBlob,
        audioUrl,
        mimeType,
        errorMessage,

        // Funções
        startRecording,
        stopRecording,
        resetRecording,
        formatDuration,

        // Constantes úteis
        MAX_DURATION,
        isRecording: status === 'recording',
        hasRecording: status === 'stopped' && audioBlob !== null,
        hasError: status === 'error'
    };
};

export default useAudioRecorder;
