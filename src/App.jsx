import CuratedSageuk from './components/tmdb/curatedSageuk';
import { MyRoutes } from './routes/MyRoutes';
import './styles/index.scss';

function App() {
    return (
        <>
            <MyRoutes />
            <CuratedSageuk />
        </>
    );
}

export default App;
