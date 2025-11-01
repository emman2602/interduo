'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const NUMERO_DE_PREGUNTAS = 2; 

export async function createInterviewAction(subareaId: string, interviewType: 'tecnica' | 'competencias') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autenticado' };
  }

  // 1. NUEVO: Obtener la experiencia del usuario de 'user_roles'
  const { data: profile, error: profileError } = await supabase
    .from('user_roles')
    .select('selected_experience')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'No se pudo encontrar el perfil del usuario.' };
  }

  // Mapear la experiencia a los niveles de dificultad
  // (Esto conecta tu UI con tu base de datos)
  let difficultyLevels: number[];
  switch (profile.selected_experience) {
    case 'beginner':
      difficultyLevels = [1]; // "beginner" solo obtiene preguntas de nivel 1
      break;
    case 'intermediate':
      difficultyLevels = [2]; // "intermediate" solo obtiene nivel 2
      break;
    case 'advanced':
      difficultyLevels = [3]; // "advanced" solo obtiene nivel 3
      break;
    default:
      difficultyLevels = [1]; // Por si acaso, dar las más fáciles
  }

  // 1. Mapea la elección del botón a los 'question_types' de tu DB
  // (Según tu DB: 'hard_skill', 'soft_skill', 'coding_exercise')
  const typesToFetch = interviewType === 'tecnica' 
    ? ['hard_skill', 'coding_exercise'] 
    : ['soft_skill'];

  try {
    // 2. CREAR LA ENTREVISTA PRINCIPAL
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .insert({
        user_id: user.id,
        subarea_id: subareaId,
        status: 'in_progress',
      })
      .select('id') // ¡Importante! Pide que te devuelva el ID
      .single();

    if (interviewError) throw interviewError;
    const newInterviewId = interview.id;


    // 3. OBTENER LOS IDs DE LOS TIPOS DE PREGUNTA
    const { data: questionTypes, error: typeError } = await supabase
      .from('question_types')
      .select('id')
      .in('name', typesToFetch); // Busca los IDs para ['hard_skill', 'coding_exercise']

    if (typeError) throw typeError;
    const typeIds = questionTypes.map(qt => qt.id);
    

    // 4. SELECCIONAR PREGUNTAS ALEATORIAS
    const { data: questions, error: questionError } = await supabase.rpc(
      'get_random_questions',
      {
        p_subarea_id: subareaId,
        p_type_ids: typeIds,
        p_difficulty_levels: difficultyLevels, // NUEVO: Pasa el array de dificultad
        p_limit: NUMERO_DE_PREGUNTAS
      }
    );

    if (questionError) throw questionError;

    if (!questions || questions.length === 0) {
      throw new Error('No se encontraron preguntas para esta selección (revisa tipo y dificultad).');
    }

    
    // 5. VINCULAR LAS PREGUNTAS A LA ENTREVISTA
    const interviewQuestionsData = questions.map((q:any, index: number) => ({
      interview_id: newInterviewId,
      question_id: q.id,
      position: index + 1,
    }));

    const { error: iqError } = await supabase
      .from('interview_questions')
      .insert(interviewQuestionsData);

    if (iqError) throw iqError;
    
    // 6. DEVOLVER EL ID DE LA ENTREVISTA
    return { data: newInterviewId };

  } catch (error: any) {
    console.error('Error creando entrevista:', error.message);
    return { error: error.message };
  }
}