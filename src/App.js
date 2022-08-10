import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import Home from './view/Home';
import Upload from './view/Upload';
import Plot from './view/Plot';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="upload" element={<Upload />} />
                <Route path="upload/plot" element={<Plot />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
