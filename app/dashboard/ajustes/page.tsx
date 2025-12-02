import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button2';
import { 
  User, 
  ShieldCheck, 
  Clock, 
  BadgeCheck, 
  Settings, 
  Bell 
} from 'lucide-react';


export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Obtener Rol y Estado de Solicitud
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const { data: application } = await supabase
    .from('expert_applications')
    .select('status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) // Traer la más reciente
    .limit(1)
    .single();

  const isExpert = userRole?.role === 'expert';
  const applicationStatus = application?.status; // 'pending', 'approved', 'rejected'

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-8 h-8 text-gray-400" />
          Ajustes de Cuenta
        </h1>
        <p className="text-gray-500 mt-2">Gestiona tu perfil y preferencias en InterDuo.</p>
      </header>

      <div className="grid gap-8">
        
        {/* --- TARJETA DE PERFIL --- */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Información Personal
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">Usuario</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-600 border border-gray-200">
                  Plan Gratuito
                </span>
                <span className={`px-2 py-1 text-xs rounded-md border ${
                  isExpert 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {isExpert ? 'Evaluador Experto' : 'Candidato'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- ZONA DE EXPERTOS (La lógica clave) --- */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-32 h-32" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2 relative z-10">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Zona de Expertos
          </h2>
          
          <div className="relative z-10">
            {isExpert ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-green-800">¡Eres un Evaluador Verificado!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Gracias por contribuir a la comunidad. Tienes acceso al panel de evaluación para revisar entrevistas.
                    </p>
                    <Link href="/dashboard">
                      <Button className="mt-3 bg-green-600 hover:bg-green-700  border-none">
                        Ir al Panel de Experto
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : applicationStatus === 'pending' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800">Solicitud en Revisión</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Recibimos tu solicitud el {new Date(application?.created_at).toLocaleDateString()}. 
                      Nuestro equipo la está revisando. Te notificaremos pronto.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4 max-w-xl">
                  ¿Tienes experiencia en reclutamiento o áreas técnicas? Únete a nuestro equipo de evaluadores expertos, gana reputación en la comunidad y ayuda a otros a conseguir el trabajo de sus sueños.
                </p>
                <Link href="/dashboard/ajustes/experto">
                  <Button>
                    Aplicar para ser Experto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* --- OTRAS OPCIONES --- */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Notificaciones por correo</span>
              </div>
              <div className="h-5 w-9 bg-gray-200 rounded-full relative">
                <div className="h-3 w-3 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 my-2"></div>

            
          </div>
        </section>

      </div>
    </div>
  );
}