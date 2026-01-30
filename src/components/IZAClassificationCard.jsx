/**
 * Componente para exibir classificação automática da IA IZA
 * Design institucional do GDF
 */
const IZAClassificationCard = ({ classification }) => {
    if (!classification) return null;

    const {
        category,
        suggestedAgency,
        tags,
        priority,
        privacyAlert,
        confidence,
        rationale
    } = classification;

    // Cores por prioridade
    const priorityColors = {
        'ALTA': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        'MÉDIA': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        'BAIXA': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    };

    const priorityColor = priorityColors[priority] || priorityColors['BAIXA'];

    return (
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">
                        Classificação Automática (IZA)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                        Análise por Inteligência Artificial
                    </p>
                </div>
            </div>

            {/* Categoria e Órgão */}
            <div className="space-y-3">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Categoria Identificada
                    </p>
                    <p className="text-[#111418] dark:text-white text-base font-bold">
                        {category}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Órgão Sugerido
                    </p>
                    <p className="text-[#111418] dark:text-white text-sm font-medium">
                        {suggestedAgency}
                    </p>
                </div>
            </div>

            {/* Prioridade */}
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Prioridade Sugerida
                </p>
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-bold text-sm ${priorityColor}`}
                    role="status"
                    aria-label={`Prioridade ${priority}`}
                >
                    <span className="material-symbols-outlined text-sm">
                        {priority === 'ALTA' && 'priority_high'}
                        {priority === 'MÉDIA' && 'remove'}
                        {priority === 'BAIXA' && 'arrow_downward'}
                    </span>
                    {priority}
                </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                        Indicadores Identificados
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-medium"
                                aria-label={`Tag: ${tag}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Confiança */}
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Confiança da Classificação
                </p>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${confidence * 100}%` }}
                            role="progressbar"
                            aria-valuenow={Math.round(confidence * 100)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <span className="text-[#111418] dark:text-white font-bold text-sm tabular-nums">
                        {Math.round(confidence * 100)}%
                    </span>
                </div>
            </div>

            {/* Alerta de Privacidade */}
            {privacyAlert && (
                <div
                    className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg"
                    role="alert"
                    aria-label="Alerta de privacidade"
                >
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-0.5">warning</span>
                    <div>
                        <p className="text-amber-800 dark:text-amber-200 text-sm font-bold mb-1">
                            Alerta de Privacidade
                        </p>
                        <p className="text-amber-700 dark:text-amber-300 text-xs">
                            Detectados possíveis dados pessoais (CPF, e-mail, telefone, etc.).
                            Recomenda-se revisar e ocultar informações sensíveis antes da publicação.
                        </p>
                    </div>
                </div>
            )}

            {/* Justificativa */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Justificativa
                </p>
                <p className="text-[#111418] dark:text-white text-sm leading-relaxed">
                    {rationale}
                </p>
            </div>

            {/* Disclaimer */}
            <div className="pt-2">
                <p className="text-xs text-gray-400 dark:text-slate-500 italic">
                    Esta classificação é sugestiva e baseada em análise automática.
                    A análise final será realizada por servidor público responsável.
                </p>
            </div>
        </div>
    );
};

export default IZAClassificationCard;
