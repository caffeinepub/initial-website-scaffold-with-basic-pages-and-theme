import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PortfolioPage from './pages/PortfolioPage';
import CertificatesPage from './pages/CertificatesPage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

type Route = '/' | '/about' | '/contact' | '/portfolio' | '/certificates';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');

  useEffect(() => {
    // Handle initial route
    const path = window.location.pathname as Route;
    if (path === '/' || path === '/about' || path === '/contact' || path === '/portfolio' || path === '/certificates') {
      setCurrentRoute(path);
    }

    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname as Route;
      if (path === '/' || path === '/about' || path === '/contact' || path === '/portfolio' || path === '/certificates') {
        setCurrentRoute(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: Route) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/portfolio':
        return <PortfolioPage navigate={navigate} />;
      case '/certificates':
        return <CertificatesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <SiteLayout currentRoute={currentRoute} navigate={navigate}>
      {renderPage()}
    </SiteLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
