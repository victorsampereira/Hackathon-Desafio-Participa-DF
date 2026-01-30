import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ManifestationDraftProvider } from './context/ManifestationDraftContext';

// Pages
import SplashPage from './pages/SplashPage';
import WelcomePage from './pages/WelcomePage';
import FormTextPage from './pages/FormTextPage';
import FormAudioPage from './pages/FormAudioPage';
import FormMediaPage from './pages/FormMediaPage';
import FormLocationPage from './pages/FormLocationPage';
import FormIdentificationPage from './pages/FormIdentificationPage';
import ReviewPage from './pages/ReviewPage';
import SuccessPage from './pages/SuccessPage';

function App() {
    return (
        <ManifestationDraftProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SplashPage />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/form-text" element={<FormTextPage />} />
                    <Route path="/form-audio" element={<FormAudioPage />} />
                    <Route path="/form-media" element={<FormMediaPage />} />
                    <Route path="/form-location" element={<FormLocationPage />} />
                    <Route path="/form-id" element={<FormIdentificationPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                </Routes>
            </BrowserRouter>
        </ManifestationDraftProvider>
    );
}

export default App;
