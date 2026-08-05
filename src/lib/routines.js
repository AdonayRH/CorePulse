import { supabase } from './supabase'

function toFrontend(row) {
  return {
    id:          row.id,
    trainerId:   row.trainer_id,
    name:        row.name,
    description: row.description,
    status:      row.status,
    exercises:   row.exercises || [],
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  }
}

function toDB(routine) {
  return {
    name:        routine.name,
    description: routine.description || '',
    status:      routine.status || 'draft',
    exercises:   routine.exercises || [],
  }
}

// ─── Trainer CRUD ─────────────────────────────────────────────────────────────

export async function fetchTrainerRoutines(trainerId) {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(toFrontend)
}

export async function createRoutine(trainerId, routineData) {
  const { data, error } = await supabase
    .from('routines')
    .insert({ trainer_id: trainerId, ...toDB(routineData) })
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

export async function updateRoutine(routineId, routineData) {
  const { data, error } = await supabase
    .from('routines')
    .update({ ...toDB(routineData), updated_at: new Date().toISOString() })
    .eq('id', routineId)
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

export async function deleteRoutine(routineId) {
  const { error } = await supabase.from('routines').delete().eq('id', routineId)
  if (error) throw error
}

export async function toggleRoutineStatus(routineId, currentStatus) {
  const next = currentStatus === 'published' ? 'draft' : 'published'
  const { data, error } = await supabase
    .from('routines')
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq('id', routineId)
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function getRoutineAssignments(routineId) {
  const { data, error } = await supabase
    .from('routine_assignments')
    .select('user_id')
    .eq('routine_id', routineId)
  if (error) throw error
  return (data || []).map(a => a.user_id)
}

export async function assignRoutineToUser(routineId, userId, trainerId) {
  const { error } = await supabase
    .from('routine_assignments')
    .upsert({ routine_id: routineId, user_id: userId, trainer_id: trainerId },
             { onConflict: 'routine_id,user_id' })
  if (error) throw error
}

export async function unassignRoutineFromUser(routineId, userId) {
  const { error } = await supabase
    .from('routine_assignments')
    .delete()
    .eq('routine_id', routineId)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── User: rutinas asignadas ──────────────────────────────────────────────────

export async function fetchAssignedRoutines() {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('status', 'published')
    .order('name')
  if (error) throw error
  return (data || []).map(toFrontend)
}
