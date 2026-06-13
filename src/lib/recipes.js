import { supabase } from './supabase'

// ─── Mappers snake_case ↔ camelCase ──────────────────────────────────────────

function toFrontend(row) {
  return {
    id:          row.id,
    trainerId:   row.trainer_id,
    name:        row.name,
    category:    row.category,
    description: row.description,
    servings:    row.servings,
    prepTime:    row.prep_time,
    cookTime:    row.cook_time,
    status:      row.status,
    ingredients: row.ingredients  || [],
    steps:       row.steps        || [],
    nutrition:   row.nutrition    || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    allergens:   row.allergens    || [],
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  }
}

function toDB(recipe) {
  return {
    name:        recipe.name,
    category:    recipe.category,
    description: recipe.description  || '',
    servings:    recipe.servings      || 1,
    prep_time:   recipe.prepTime      ?? 0,
    cook_time:   recipe.cookTime      ?? 0,
    status:      recipe.status        || 'draft',
    ingredients: recipe.ingredients  || [],
    steps:       recipe.steps        || [],
    nutrition:   recipe.nutrition    || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    allergens:   recipe.allergens    || [],
  }
}

// ─── Trainer: CRUD de recetas ─────────────────────────────────────────────────

export async function fetchTrainerRecipes(trainerId) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(toFrontend)
}

export async function createRecipe(trainerId, recipeData) {
  const { data, error } = await supabase
    .from('recipes')
    .insert({ trainer_id: trainerId, ...toDB(recipeData) })
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

export async function updateRecipe(recipeId, recipeData) {
  const { data, error } = await supabase
    .from('recipes')
    .update(toDB(recipeData))
    .eq('id', recipeId)
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

export async function deleteRecipe(recipeId) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
  if (error) throw error
}

export async function toggleRecipeStatus(recipeId, currentStatus) {
  const next = currentStatus === 'published' ? 'draft' : 'published'
  const { data, error } = await supabase
    .from('recipes')
    .update({ status: next })
    .eq('id', recipeId)
    .select()
    .single()
  if (error) throw error
  return toFrontend(data)
}

// ─── Asignaciones ────────────────────────────────────────────────────────────

export async function getAssignableUsers() {
  const { data, error } = await supabase.rpc('get_assignable_users')
  if (error) throw error
  return data || []
}

export async function getRecipeAssignments(recipeId) {
  const { data, error } = await supabase
    .from('recipe_assignments')
    .select('user_id')
    .eq('recipe_id', recipeId)
  if (error) throw error
  return (data || []).map(a => a.user_id)
}

export async function assignRecipeToUser(recipeId, userId, trainerId) {
  const { error } = await supabase
    .from('recipe_assignments')
    .upsert({ recipe_id: recipeId, user_id: userId, trainer_id: trainerId },
             { onConflict: 'recipe_id,user_id' })
  if (error) throw error
}

export async function unassignRecipeFromUser(recipeId, userId) {
  const { error } = await supabase
    .from('recipe_assignments')
    .delete()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Alumno: recetas asignadas ───────────────────────────────────────────────

export async function fetchAssignedRecipes() {
  // RLS filtra automáticamente: solo las recetas publicadas asignadas al usuario actual
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .order('category', { ascending: true })
  if (error) throw error
  return (data || []).map(toFrontend)
}
