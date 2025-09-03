import { createClient } from './supabase'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role?: string
  emailVerified?: Date
}

export interface Session {
  user: User
  expires: string
}

export class SupabaseAuth {
  private supabase = createClient()

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return this.formatUser(data.user)
  }

  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'USER', // Default role
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return this.formatUser(data.user)
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) {
      throw new Error(error.message)
    }
    return user ? this.formatUser(user) : null
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    if (error) {
      throw new Error(error.message)
    }

    if (!session) {
      return null
    }

    return {
      user: this.formatUser(session.user),
      expires: new Date(session.expires_at! * 1000).toISOString(),
    }
  }

  private formatUser(user: any): User {
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      image: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role || 'USER',
      emailVerified: user.email_confirmed_at ? new Date(user.email_confirmed_at) : undefined,
    }
  }

  // Admin functions
  async createAdminUser(email: string, password: string, name: string) {
    const { createSupabaseAdmin } = await import('./supabase')
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role: 'ADMIN',
      },
      email_confirm: true,
    })

    if (error) {
      throw new Error(error.message)
    }

    return this.formatUser(data.user)
  }

  async updateUserRole(userId: string, role: string) {
    const { createSupabaseAdmin } = await import('./supabase')
    const supabase = createSupabaseAdmin()

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}

export const supabaseAuth = new SupabaseAuth()
