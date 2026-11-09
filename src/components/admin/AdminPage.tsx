import { useEffect, useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';
import { adminLogout, clearSession, loadSession, type AdminSession } from '@/lib/admin';

export default function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(() => loadSession());

  const signOut = () => {
    if (session) {
      adminLogout(session.token).catch(() => undefined);
    }
    clearSession();
    setSession(null);
  };

  useEffect(() => {
    if (!session) return;
    const remaining = new Date(session.expiresAt).getTime() - Date.now();
    const timer = window.setTimeout(() => {
      clearSession();
      setSession(null);
    }, Math.max(remaining, 0));
    return () => window.clearTimeout(timer);
  }, [session]);

  if (!session) {
    return <AdminLogin onSignedIn={setSession} />;
  }

  return <AdminDashboard token={session.token} onSignOut={signOut} />;
}
