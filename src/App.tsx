import { useEffect, useState } from 'react';
import About from '@/components/About';
import AdminPage from '@/components/admin/AdminPage';
import CallToAction from '@/components/CallToAction';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import PropertyListings from '@/components/PropertyListings';
import WhatsAppButton from '@/components/WhatsAppButton';

const ADMIN_HASH = '#/admin';

function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash === ADMIN_HASH) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main>
        <Hero />
        <About />
        <PropertyListings />
        <Contact />
        <CallToAction />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
