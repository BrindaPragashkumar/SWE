import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Sidebar from './components/Sidebar';
import httpClient from './httpClient';
import AddPropertyPage from './pages/AddPropertyPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import PersonalPropertiesPage from './pages/PersonalPropertiesPage';
import AllPropertiesPage from './pages/AllPropertiesPage';
import ViewingListPage from './pages/ViewingListPage';
import EditPropertyPage from './pages/EditPropertyPage';
import SearchPage from './pages/SearchPage';

const Router = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get('//localhost:5000/@me');
        setUser(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        {user && <Sidebar user={user} />}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-property" element={<AddPropertyPage user={user} />} />
            <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />
            <Route path="/properties" element={<PersonalPropertiesPage />} />
            <Route path="/all-properties" element={<AllPropertiesPage />} />
            <Route path="/viewing-list" element={<ViewingListPage />} />
            <Route path="/edit-property/:propertyId" element={<EditPropertyPage user={user} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Router;