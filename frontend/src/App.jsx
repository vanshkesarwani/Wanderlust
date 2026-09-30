import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import NewListingPage from './pages/NewListingPage';
import EditListingPage from './pages/EditListingPage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<ListingsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                <Route path="/listings" element={<Navigate to="/" replace />} />
                <Route path="/listings/new" element={<NewListingPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/listings/:id/edit" element={<EditListingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <AuthModal />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
