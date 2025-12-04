import NotificationSection from './NotificationSection';
export default function NotificationPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Mis Notificaciones</h1>
      <NotificationSection />
    </main>
  );
}