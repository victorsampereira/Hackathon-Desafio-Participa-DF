import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { dispatch, actions } = useManifestationDraft();

    const handleOptionClick = (channel, path) => {
        // Define o canal escolhido
        dispatch({ type: actions.SET_CHANNEL, payload: channel });
        // Navega para a página correspondente
        navigate(path);
    };

    const options = [
        { icon: 'edit', title: 'Escrever', subtitle: 'Relato por texto', path: '/form-text', channel: 'text' },
        { icon: 'mic', title: 'Falar', subtitle: 'Gravar um áudio', path: '/form-audio', channel: 'audio' },
        { icon: 'photo_camera', title: 'Foto', subtitle: 'Tirar ou anexar foto', path: '/form-media', channel: 'image' },
        { icon: 'videocam', title: 'Vídeo', subtitle: 'Gravar ou enviar vídeo', path: '/form-media', channel: 'video' },
    ];

    return (
        <Layout showBack={false} showNav={false} title="Ouvidoria GDF">{/* Removida tab bar */}
            <div className="px-4 pb-10">
                <div className="pt-8 pb-3">
                    <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight">
                        Quer contar o que aconteceu?
                    </h1>
                </div>

                <div className="pb-8">
                    <p className="text-[#4b5563] dark:text-gray-400 text-lg font-normal leading-relaxed">
                        Você pode escrever, falar ou enviar uma imagem ou vídeo para registrar sua manifestação.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.channel, opt.path)}
                            className="flex items-center gap-4 bg-primary text-white p-5 rounded-xl shadow-sm active:scale-[0.98] transition-transform w-full"
                            aria-label={`${opt.title} - ${opt.subtitle}`}
                        >
                            <div className="bg-white/20 p-3 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined fill-1">{opt.icon}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xl font-bold">{opt.title}</span>
                                <span className="text-white/80 text-sm">{opt.subtitle}</span>
                            </div>
                            <span className="material-symbols-outlined ml-auto opacity-60">chevron_right</span>
                        </button>
                    ))}
                </div>

                <div className="mt-10 mb-4 flex flex-col items-center justify-center opacity-40">
                    <p className="text-xs font-bold tracking-widest uppercase text-[#111418] dark:text-white">
                        Governo do Distrito Federal
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default WelcomePage;

