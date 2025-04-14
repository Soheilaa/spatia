import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location/:lat/:lon" element={<LocationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
