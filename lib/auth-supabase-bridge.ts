import { supabaseAuth } from './auth-supabase'
import { logger } from './logger'
import { analytics } from './analytics'

export async function getServerSession() {
  try {
    return await supabaseAuth.getSession()
  } catch (error) {
    logger.error('Failed to get server session:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    return await supabaseAuth.getUser()
  } catch (error) {
    logger.error('Failed to get current user:', error)
    return null
  }
}

export const auth = {
  signIn: supabaseAuth.signIn.bind(supabaseAuth),
  signUp: supabaseAuth.signUp.bind(supabaseAuth),
  signOut: supabaseAuth.signOut.bind(supabaseAuth),
  getUser: supabaseAuth.getUser.bind(supabaseAuth),
  getSession: supabaseAuth.getSession.bind(supabaseAuth),
  createAdminUser: supabaseAuth.createAdminUser.bind(supabaseAuth),
  updateUserRole: supabaseAuth.updateUserRole.bind(supabaseAuth),
}
