import { supabase } from './supabase'

function mapRecipe(r) {
  if (!r) return null
  return {
    id:          r.id,
    name:        r.name,
    category:    r.category,
    description: r.description,
    servings:    r.servings,
    prepTime:    r.prep_time,
    cookTime:    r.cook_time,
    status:      r.status,
    nutrition:   r.nutrition   || {},
    allergens:   r.allergens   || [],
    ingredients: r.ingredients || [],
    steps:       r.steps       || [],
  }
}

function toFrontend(row) {
  return {
    id:         row.id,
    trainerId:  row.trainer_id,
    userId:     row.user_id,
    recipeId:   row.recipe_id,
    dayOfWeek:  row.day_of_week,
    mealSlot:   row.meal_slot,
    recipe:     mapRecipe(row.recipe),
  }
}

const RECIPE_FIELDS = 'id,name,category,description,servings,prep_time,cook_time,status,nutrition,allergens,ingredients,steps'

// Trainer: fetch a user's meal plan (to edit it)
export async function fetchTrainerMealPlan(userId) {
  const { data, error } = await supabase
    .from('meal_plan_entries')
    .select(`*, recipe:recipe_id(${RECIPE_FIELDS})`)
    .eq('user_id', userId)
    .order('day_of_week')
  if (error) throw error
  return (data || []).map(toFrontend)
}

// User: fetch own meal plan (RLS filters automatically)
export async function fetchUserMealPlan() {
  const { data, error } = await supabase
    .from('meal_plan_entries')
    .select(`*, recipe:recipe_id(${RECIPE_FIELDS})`)
    .order('day_of_week')
  if (error) throw error
  return (data || []).map(toFrontend)
}

// Trainer: set (upsert) a cell in a user's plan
export async function setMealPlanEntry(userId, trainerId, dayOfWeek, mealSlot, recipeId) {
  const { error } = await supabase
    .from('meal_plan_entries')
    .upsert(
      { user_id: userId, trainer_id: trainerId, day_of_week: dayOfWeek, meal_slot: mealSlot, recipe_id: recipeId },
      { onConflict: 'user_id,day_of_week,meal_slot' }
    )
  if (error) throw error
}

// Trainer: clear a cell
export async function removeMealPlanEntry(userId, dayOfWeek, mealSlot) {
  const { error } = await supabase
    .from('meal_plan_entries')
    .delete()
    .eq('user_id', userId)
    .eq('day_of_week', dayOfWeek)
    .eq('meal_slot', mealSlot)
  if (error) throw error
}
