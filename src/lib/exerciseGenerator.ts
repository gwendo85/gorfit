import { createClient } from './supabase'
import { ExerciseTemplate, Exercise } from '@/types'
import toast from 'react-hot-toast'

export async function generateExercisesFromTemplate(
  sessionId: string,
  programId: string,
  weekNumber: number,
  sessionNumber: number
): Promise<Exercise[]> {
  const supabase = createClient()

  try {
    // 1. Récupérer les templates d'exercices pour cette séance
    const { data: templates, error: templatesError } = await supabase
      .from('exercise_templates')
      .select('*')
      .eq('program_id', programId)
      .eq('week_number', weekNumber)
      .eq('session_number', sessionNumber)
      .order('order_index')

    if (templatesError) {
      console.error('Erreur récupération templates:', templatesError)
      toast.error('Erreur lors de la génération des exercices')
      return []
    }

    if (!templates || templates.length === 0) {
      console.warn('Aucun template trouvé pour cette séance')
      toast.error('Aucun exercice défini pour cette séance')
      return []
    }

    // 2. Créer les exercices à partir des templates
    const exercisesToInsert = templates.map((template: ExerciseTemplate) => ({
      session_id: sessionId,
      name: template.exercise_name,
      type: template.exercise_type,
      sets: template.sets,
      reps: template.reps,
      weight: template.weight || 0,
      note: template.notes || '',
      completed: false
    }))

    // 3. Insérer les exercices dans la base de données
    const { data: createdExercises, error: insertError } = await supabase
      .from('exercises')
      .insert(exercisesToInsert)
      .select()

    if (insertError) {
      console.error('Erreur insertion exercices:', insertError)
      toast.error('Erreur lors de la création des exercices')
      return []
    }

    console.log(`${createdExercises?.length || 0} exercices générés avec succès`)
    toast.success(`${createdExercises?.length || 0} exercices générés !`)

    return createdExercises || []

  } catch (error) {
    console.error('Erreur complète génération exercices:', error)
    toast.error('Erreur lors de la génération des exercices')
    return []
  }
}

export async function checkIfExercisesExist(sessionId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('id')
      .eq('session_id', sessionId)

    if (error) {
      console.error('Erreur vérification exercices:', error)
      return false
    }

    return (exercises?.length || 0) > 0
  } catch (error) {
    console.error('Erreur complète vérification exercices:', error)
    return false
  }
} 