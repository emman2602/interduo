'use server';

import { createClient } from '@/lib/supabase/server';

const NUMERO_DE_PREGUNTAS = 2;

// Tipos auxiliares para determinar el tipo de entrevista
type InterviewType = 'tecnica' | 'competencias';

interface Question {
  id: string;
  text?: string;
  type_id?: string;
  difficulty?: number;
  [key: string]: unknown; // por si la función RPC devuelve más columnas
}

interface CreateInterviewResult {
  data?: string;
  error?: string;
}

export async function createInterviewAction(
  subareaId: string,
  interviewType: InterviewType
): Promise<CreateInterviewResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autenticado' };
  }

  // 1. Obtener experiencia del usuario
  const { data: profile, error: profileError } = await supabase
    .from('user_roles')
    .select('selected_experience')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'No se pudo encontrar el perfil del usuario.' };
  }

  let difficultyLevels: number[];
  switch (profile.selected_experience) {
    case 'beginner':
      difficultyLevels = [1];
      break;
    case 'intermediate':
      difficultyLevels = [2];
      break;
    case 'advanced':
      difficultyLevels = [3];
      break;
    default:
      difficultyLevels = [1];
  }

  const typesToFetch =
    interviewType === 'tecnica'
      ? ['hard_skill', 'coding_exercise']
      : ['soft_skill'];

  try {
    // 2. Crear la entrevista
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .insert({
        user_id: user.id,
        subarea_id: subareaId,
        status: 'in_progress',
      })
      .select('id')
      .single();

    if (interviewError) throw interviewError;
    const newInterviewId = interview.id;

    // 3. Obtener IDs de tipos de pregunta
    const { data: questionTypes, error: typeError } = await supabase
      .from('question_types')
      .select('id')
      .in('name', typesToFetch);

    if (typeError) throw typeError;
    const typeIds = (questionTypes ?? []).map((qt) => qt.id);

    // 4. Seleccionar preguntas aleatorias
    const { data: questions, error: questionError } = await supabase.rpc(
      'get_random_questions',
      {
        p_subarea_id: subareaId,
        p_type_ids: typeIds,
        p_difficulty_levels: difficultyLevels,
        p_limit: NUMERO_DE_PREGUNTAS,
      }
    );

    if (questionError) throw questionError;
    if (!questions || questions.length === 0) {
      throw new Error(
        'No se encontraron preguntas para esta selección (revisa tipo y dificultad).'
      );
    }

    // 5. Vincular preguntas con la entrevista
    const interviewQuestionsData = (questions as Question[]).map(
      (q, index) => ({
        interview_id: newInterviewId,
        question_id: q.id,
        position: index + 1,
      })
    );

    const { error: iqError } = await supabase
      .from('interview_questions')
      .insert(interviewQuestionsData);

    if (iqError) throw iqError;

    return { data: newInterviewId };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido al crear la entrevista.';
    console.error('Error creando entrevista:', message);
    return { error: message };
  }
}
