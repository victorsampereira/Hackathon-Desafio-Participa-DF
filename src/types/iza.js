/**
 * Tipos para integração com IA IZA (Mock)
 * Sistema de classificação automática de manifestações
 */

/**
 * Entrada para classificação pela IZA
 * @typedef {Object} IZAInput
 * @property {'text'|'audio'|'image'|'video'} channel - Canal de comunicação
 * @property {string} text - Texto digitado pelo usuário
 * @property {string} [transcript] - Transcrição de áudio (se disponível)
 * @property {string} [userProvidedDescription] - Descrição fornecida para anexos
 * @property {Object[]} [attachmentsMeta] - Metadados de anexos
 * @property {boolean} anonymous - Se manifestação é anônima
 */

/**
 * Resultado da classificação pela IZA
 * @typedef {Object} IZAResult
 * @property {string} category - Categoria identificada
 * @property {string} suggestedAgency - Órgão sugerido
 * @property {string[]} tags - Tags extraídas
 * @property {'BAIXA'|'MÉDIA'|'ALTA'} priority - Prioridade
 * @property {boolean} privacyAlert - Alerta de dados pessoais
 * @property {number} confidence - Confiança (0 a 1)
 * @property {string} rationale - Explicação da classificação
 */

/**
 * Metadados de anexo
 * @typedef {Object} AttachmentMeta
 * @property {'audio'|'image'|'video'|'text'} type - Tipo do anexo
 * @property {string} name - Nome do arquivo
 * @property {number} size - Tamanho em bytes
 */

export const IZAPriority = {
    LOW: 'BAIXA',
    MEDIUM: 'MÉDIA',
    HIGH: 'ALTA'
};

export const IZACategory = {
    HEALTH: 'Saúde',
    TRANSPORT: 'Transporte e Mobilidade',
    EDUCATION: 'Educação',
    SECURITY: 'Segurança Pública',
    URBAN_SERVICES: 'Serviços Urbanos',
    NOISE: 'Fiscalização e Ordem Pública',
    GENERAL: 'Atendimento ao Cidadão'
};

export const IZAAgency = {
    HEALTH: 'Secretaria de Saúde do DF',
    TRANSPORT: 'Secretaria de Transporte e Mobilidade do DF',
    EDUCATION: 'Secretaria de Educação do DF',
    SECURITY: 'Secretaria de Segurança Pública do DF',
    SLU: 'SLU - Serviço de Limpeza Urbana',
    NOVACAP: 'NOVACAP',
    CAESB: 'CAESB',
    DF_LEGAL: 'DF Legal',
    GENERAL: 'Ouvidoria-Geral do DF'
};
