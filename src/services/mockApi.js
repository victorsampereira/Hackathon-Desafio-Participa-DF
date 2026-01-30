/**
 * Mock API para sistema de manifestações
 * Simula envio sem backend real
 */

import { ErrorCode } from '../types/manifestation';

/**
 * Gera número de protocolo único
 * Formato: DF-2026-xxxxx
 */
const generateProtocol = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 99999);
    const sequential = (timestamp % 100000 + random) % 100000;
    return `DF-2026-${sequential.toString().padStart(5, '0')}`;
};

/**
 * Gera ID único para anexo
 */
const generateAttachmentId = (index) => {
    return `att-${(index + 1).toString().padStart(3, '0')}`;
};

/**
 * Simula delay de rede
 */
const simulateNetworkDelay = () => {
    const min = 700;
    const max = 1200;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Valida draft antes de enviar
 */
const validateDraft = (draft) => {
    if (!draft) {
        return { valid: false, error: 'Draft não pode ser vazio' };
    }

    // Validações por canal
    switch (draft.channel) {
        case 'text':
            if (!draft.contentText || draft.contentText.trim().length === 0) {
                return {
                    valid: false,
                    error: 'Manifestação por texto precisa ter conteúdo'
                };
            }
            break;

        case 'audio':
            if (!draft.audioBlob && !draft.audioMimeType) {
                return {
                    valid: false,
                    error: 'Manifestação por áudio precisa ter gravação'
                };
            }
            break;

        case 'image':
        case 'video':
            if (!draft.mediaFiles || draft.mediaFiles.length === 0) {
                // Verificar também metadados se vier de rascunho restaurado
                if (!draft.mediaMetadata || draft.mediaMetadata.length === 0) {
                    return {
                        valid: false,
                        error: `Manifestação por ${draft.channel === 'image' ? 'imagem' : 'vídeo'} precisa ter ao menos 1 arquivo`
                    };
                }
            }
            break;

        default:
            return { valid: false, error: 'Canal de comunicação inválido' };
    }

    return { valid: true };
};

/**
 * Mapeia arquivos de mídia para metadados de attachment
 */
const mapMediaToAttachments = (draft) => {
    const attachments = [];

    // Processar arquivos de mídia (imagem/vídeo)
    if (draft.mediaFiles && draft.mediaFiles.length > 0) {
        draft.mediaFiles.forEach((file, index) => {
            attachments.push({
                id: generateAttachmentId(index),
                name: file.name,
                type: file.type,
                size: file.size
            });
        });
    } else if (draft.mediaMetadata && draft.mediaMetadata.length > 0) {
        // Se vier de rascunho restaurado (apenas metadados)
        draft.mediaMetadata.forEach((meta, index) => {
            attachments.push({
                id: generateAttachmentId(index),
                name: meta.name,
                type: meta.type,
                size: meta.size
            });
        });
    }

    // Adicionar áudio se houver
    if (draft.audioBlob || draft.audioMimeType) {
        attachments.push({
            id: 'att-audio-001',
            name: 'gravacao-audio.webm',
            type: draft.audioMimeType || 'audio/webm',
            size: draft.audioBlob?.size || 0
        });
    }

    return attachments;
};

/**
 * Envia manifestação (MOCK - sem backend real)
 * 
 * @param {ManifestationDraft} draft - Rascunho da manifestação
 * @param {Object} options - Opções de envio
 * @param {boolean} options.forceError - Forçar erro para teste
 * @returns {Promise<SubmitResult>}
 */
export const submitManifestation = async (draft, options = {}) => {
    // Validar draft
    const validation = validateDraft(draft);
    if (!validation.valid) {
        throw {
            code: ErrorCode.VALIDATION_ERROR,
            message: validation.error
        };
    }

    // Simular delay de rede
    await simulateNetworkDelay();

    // Simular erro aleatório (8% de chance) ou forçado
    const shouldError = options.forceError || Math.random() < 0.08;

    if (shouldError) {
        const errorTypes = [
            {
                code: ErrorCode.NETWORK_TIMEOUT,
                message: 'Não foi possível enviar no momento. Verifique sua conexão e tente novamente.'
            },
            {
                code: ErrorCode.SERVER_ERROR,
                message: 'Erro temporário no servidor. Por favor, tente novamente em alguns instantes.'
            }
        ];

        const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        throw error;
    }

    // Gerar protocolo e preparar resposta
    const protocol = generateProtocol();
    const attachments = mapMediaToAttachments(draft);

    const result = {
        protocol,
        createdAtISO: new Date().toISOString(),
        status: 'RECEBIDA',
        attachments: attachments.length > 0 ? attachments : undefined
    };

    return result;
};

/**
 * Sanitiza draft para armazenamento
 * Remove Blobs e Files (que não podem ser serializados)
 * Mantém apenas metadados
 * 
 * @param {ManifestationDraft} draft
 * @returns {Object} Draft sanitizado
 */
export const sanitizeDraftForStorage = (draft) => {
    const sanitized = { ...draft };

    // Remover blob de áudio, manter apenas metadados
    if (sanitized.audioBlob) {
        delete sanitized.audioBlob;
        sanitized._hadAudio = true; // Flag para saber que tinha áudio
    }

    // Remover Files de mídia, manter apenas metadados
    if (sanitized.mediaFiles && sanitized.mediaFiles.length > 0) {
        sanitized.mediaMetadata = sanitized.mediaFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
        }));
        delete sanitized.mediaFiles;
    }

    return sanitized;
};

/**
 * Salva draft no localStorage
 * 
 * @param {ManifestationDraft} draft
 */
export const saveDraftToStorage = (draft) => {
    try {
        const sanitized = sanitizeDraftForStorage(draft);
        localStorage.setItem('participaFacil:draft', JSON.stringify(sanitized));
        return true;
    } catch (error) {
        console.error('Erro ao salvar rascunho:', error);
        return false;
    }
};

/**
 * Carrega draft do localStorage
 * 
 * @returns {ManifestationDraft|null}
 */
export const loadDraftFromStorage = () => {
    try {
        const stored = localStorage.getItem('participaFacil:draft');
        if (!stored) return null;

        const draft = JSON.parse(stored);
        return draft;
    } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
        return null;
    }
};

/**
 * Remove draft do localStorage
 */
export const clearDraftFromStorage = () => {
    try {
        localStorage.removeItem('participaFacil:draft');
        return true;
    } catch (error) {
        console.error('Erro ao limpar rascunho:', error);
        return false;
    }
};
