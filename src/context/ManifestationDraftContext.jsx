import { createContext, useContext, useReducer, useCallback } from 'react';
import { submitManifestation } from '../services/mockApi';
import { classifyWithIZA } from '../services/izaService';
import { SubmissionStatus } from '../types/manifestation';

/**
 * Context para armazenar o draft da manifestação
 * Mantém dados enquanto usuário navega entre as telas
 * 
 * Armazenado apenas em memória (não persiste em localStorage)
 */

const ManifestationDraftContext = createContext();

// Action types
const ACTIONS = {
    SET_CHANNEL: 'SET_CHANNEL',
    SET_TEXT: 'SET_TEXT',
    SET_AUDIO: 'SET_AUDIO',
    SET_LOCATION: 'SET_LOCATION',
    SET_IDENTIFICATION: 'SET_IDENTIFICATION',
    SET_MEDIA: 'SET_MEDIA',
    SET_SUBMIT_STATE: 'SET_SUBMIT_STATE',
    SET_SUBMIT_RESULT: 'SET_SUBMIT_RESULT',
    SET_SUBMIT_ERROR: 'SET_SUBMIT_ERROR',
    SET_IZA_CLASSIFICATION: 'SET_IZA_CLASSIFICATION',
    RESET: 'RESET'
};

// Estado inicial
const initialState = {
    channel: null, // 'text' | 'audio' | 'image' | 'video'
    text: '',
    audio: {
        blob: null,
        url: null,
        mimeType: '',
        duration: 0,
        recordedAt: null
    },
    location: {
        address: '',
        coordinates: null
    },
    identification: {
        type: 'anonymous', // 'anonymous' | 'identified'
        name: '',
        contact: ''
    },
    media: {
        description: '', // Descrição opcional da mídia
        image: {
            file: null,
            previewUrl: null,
            name: '',
            size: 0,
            type: ''
        },
        video: {
            file: null,
            previewUrl: null,
            name: '',
            size: 0,
            type: '',
            duration: 0
        }
    },
    // Estado de submissão
    submitState: SubmissionStatus.IDLE,
    submitResult: null,
    submitError: null,
    // Classificação IZA
    izaClassification: null
};

// Reducer
function manifestationReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_CHANNEL:
            return {
                ...state,
                channel: action.payload
            };

        case ACTIONS.SET_TEXT:
            return {
                ...state,
                text: action.payload
            };

        case ACTIONS.SET_AUDIO:
            return {
                ...state,
                audio: {
                    ...state.audio,
                    ...action.payload
                }
            };

        case ACTIONS.SET_LOCATION:
            return {
                ...state,
                location: {
                    ...state.location,
                    ...action.payload
                }
            };

        case ACTIONS.SET_IDENTIFICATION:
            return {
                ...state,
                identification: {
                    ...state.identification,
                    ...action.payload
                }
            };

        case ACTIONS.SET_MEDIA:
            return {
                ...state,
                media: {
                    ...state.media,
                    ...action.payload
                }
            };

        case ACTIONS.SET_SUBMIT_STATE:
            return {
                ...state,
                submitState: action.payload
            };

        case ACTIONS.SET_SUBMIT_RESULT:
            return {
                ...state,
                submitResult: action.payload,
                submitState: SubmissionStatus.SUCCESS
            };

        case ACTIONS.SET_SUBMIT_ERROR:
            return {
                ...state,
                submitError: action.payload,
                submitState: SubmissionStatus.ERROR
            };

        case ACTIONS.SET_IZA_CLASSIFICATION:
            return {
                ...state,
                izaClassification: action.payload
            };

        case ACTIONS.RESET:
            return initialState;

        default:
            return state;
    }
}

// Provider Component
export const ManifestationDraftProvider = ({ children }) => {
    const [state, dispatch] = useReducer(manifestationReducer, initialState);

    /**
     * Submete a manifestação
     */
    const submit = useCallback(async (options = {}) => {
        // Inicia estado de submissão
        dispatch({ type: ACTIONS.SET_SUBMIT_STATE, payload: SubmissionStatus.SUBMITTING });
        dispatch({ type: ACTIONS.SET_SUBMIT_ERROR, payload: null });

        try {
            // Prepara draft para envio
            const draft = {
                channel: state.channel,
                contentText: state.text,
                audioBlob: state.audio.blob,
                audioMimeType: state.audio.mimeType,
                audioDuration: state.audio.duration,
                mediaFiles: [
                    state.media.image.file,
                    state.media.video.file
                ].filter(Boolean),
                locationText: state.location.address,
                isAnonymous: state.identification.type === 'anonymous',
                identified: state.identification.type === 'identified' ? {
                    name: state.identification.name,
                    contact: state.identification.contact
                } : undefined,
                createdAtISO: new Date().toISOString()
            };

            // Envia usando mock API
            const result = await submitManifestation(draft, options);

            // Sucesso - salvar resultado
            dispatch({ type: ACTIONS.SET_SUBMIT_RESULT, payload: result });

            // Classifica com IA IZA (em paralelo, não bloqueia)
            try {
                const izaInput = {
                    channel: state.channel,
                    text: state.text,
                    transcript: '', // TODO: adicionar se houver transcrição de áudio
                    userProvidedDescription: state.media.description || state.location.address || '', // Descrição da mídia ou localização
                    attachmentsMeta: [
                        state.media.image.file && {
                            type: 'image',
                            name: state.media.image.name,
                            size: state.media.image.size
                        },
                        state.media.video.file && {
                            type: 'video',
                            name: state.media.video.name,
                            size: state.media.video.size
                        },
                        state.audio.blob && {
                            type: 'audio',
                            name: 'gravacao.webm',
                            size: state.audio.blob.size
                        }
                    ].filter(Boolean),
                    anonymous: state.identification.type === 'anonymous'
                };

                const classification = await classifyWithIZA(izaInput);
                dispatch({ type: ACTIONS.SET_IZA_CLASSIFICATION, payload: classification });
            } catch (izaError) {
                console.warn('Erro ao classificar com IZA (não bloqueante):', izaError);
                // Classificação falhou, mas não impede o envio
            }

            return result;

        } catch (error) {
            // Erro
            dispatch({ type: ACTIONS.SET_SUBMIT_ERROR, payload: error });
            throw error;
        }
    }, [state]);

    /**
     * Reseta estado de submissão (para tentar novamente)
     */
    const resetSubmit = useCallback(() => {
        dispatch({ type: ACTIONS.SET_SUBMIT_STATE, payload: SubmissionStatus.IDLE });
        dispatch({ type: ACTIONS.SET_SUBMIT_ERROR, payload: null });
    }, []);

    const value = {
        draft: state,
        dispatch,
        actions: ACTIONS,
        submit,
        resetSubmit,
        // Helpers
        isSubmitting: state.submitState === SubmissionStatus.SUBMITTING,
        isSuccess: state.submitState === SubmissionStatus.SUCCESS,
        isError: state.submitState === SubmissionStatus.ERROR,
        submitResult: state.submitResult,
        submitError: state.submitError
    };

    return (
        <ManifestationDraftContext.Provider value={value}>
            {children}
        </ManifestationDraftContext.Provider>
    );
};

// Hook customizado para usar o context
export const useManifestationDraft = () => {
    const context = useContext(ManifestationDraftContext);

    if (!context) {
        throw new Error('useManifestationDraft deve ser usado dentro de ManifestationDraftProvider');
    }

    return context;
};

export default ManifestationDraftContext;

