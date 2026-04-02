import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Admin from './Admin';
import ProtectedRoute from './components/common/ProtectedRoute'
import { AppProvider } from './context/AppContext';
import GlobalLoader from './components/common/GlobalLoader';
import Toast from './components/common/Toast';
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import ErrorPage from './pages/ErrorPage'
import SignatureIntake from './pages/SignatureIntake';

const App = () => {
    return (
        <AppProvider>
            <GlobalLoader />
            <Toast />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute allowedRoles={[
                        'Super Admin',
                        'Security Manager',
                        'Bank Teller',
                        'Compliance Officer',
                        'Support Staff'
                    ]} />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/signature-intake" element={<SignatureIntake />} />
                            <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
                                <Route path="/admin" element={<Admin />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
};

export default App;
