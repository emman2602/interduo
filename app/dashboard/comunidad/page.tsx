import { createClient } from '@/lib/supabase/server';
import { InterviewFeedItem } from './CommunityCard';
import CommunityTabs from './CommunityTabs'; // Importa tu nuevo componente

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. FETCH: FEED GENERAL
  const { data: publicFeed } = await supabase
    .from('vw_full_interview_feed')
    .select('*') // <--- ¡CAMBIO AQUÍ! Solo pedimos '*' (todo viene incluido)
    .neq('author_id', user?.id) 
    .order('created_at', { ascending: false })
    .limit(20);

  // 2. FETCH: MIS ENTREVISTAS (Feedback Recibido)
  const { data: myFeed } = await supabase
    .from('vw_full_interview_feed')
    .select('*') // <--- ¡CAMBIO AQUÍ! Solo '*'
    .eq('author_id', user?.id) 
    .order('created_at', { ascending: false });

  // Casting seguro
  const feedItems = (publicFeed as unknown as InterviewFeedItem[]) || [];
  const myItems = (myFeed as unknown as InterviewFeedItem[]) || [];

  return (
    <div className="min-h-screen max-w-3xl mx-auto w-full pb-20 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Comunidad InterDuo</h1>
        <p className="text-gray-500">Aprende de otros y recibe feedback valioso.</p>
      </div>

      {/* Aquí renderizamos el componente de Cliente con las pestañas */}
      <CommunityTabs publicFeed={feedItems} myFeed={myItems} />
      
    </div>
  );
}