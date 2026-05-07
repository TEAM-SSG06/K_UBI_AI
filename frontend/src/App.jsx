import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ReviewQueue from './pages/ReviewQueue';
import EntityExplorer from './pages/EntityExplorer';
import LandingPage from './pages/LandingPage';
import SchemaViewer from './pages/SchemaViewer';
import MergeVisualizer from './pages/MergeVisualizer';
import AuditLogs from './pages/AuditLogs';
import RegistryTable from './pages/RegistryTable';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (currentPage === 'landing') {
    return <LandingPage onEnter={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isDark={isDark}
        setIsDark={setIsDark}
      />
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'review' && <ReviewQueue />}
        {currentPage === 'explorer' && <EntityExplorer />}
        {currentPage === 'registry' && <RegistryTable />}
        {currentPage === 'audit' && <AuditLogs />}
        {currentPage === 'schema' && <SchemaViewer />}
        {currentPage === 'merge' && <MergeVisualizer />}
      </div>
    </div>
  );
}
