import { supabaseAdmin } from '../utils/supabase';
import { AuthError } from '@supabase/supabase-js';

export namespace SupabaseAuthService {
  // User management functions
  export async function getUserById(uuid: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(uuid);
    if (error) throw error;
    return data.user;
  }

  export async function getUserByEmail(email: string) {
    // First try to get user by exact email match
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    // Filter users manually by email
    const matchingUsers = data.users.filter(user => user.email === email);
    return matchingUsers.length > 0 ? matchingUsers[0] : null;
  }
  
  export async function createUser(email: string, password: string, userData?: object) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    });
    if (error) throw error;
    return data.user;
  }

  export async function updateUser(uuid: string, updates: {
    email?: string,
    password?: string,
    userData?: object
  }) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      uuid,
      {
        email: updates.email,
        password: updates.password,
        user_metadata: updates.userData
      }
    );
    if (error) throw error;
    return data.user;
  }

  export async function deleteUser(uuid: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(uuid);
    if (error) throw error;
    return true;
  }

  // Generate magic link for passwordless login
  export async function generateMagicLink(email: string) {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email
    });
    if (error) throw error;
    return data;
  }

  // Send invite with custom redirectUrl
  export async function inviteUser(email: string, redirectUrl: string) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: redirectUrl
    });
    if (error) throw error;
    return data;
  }

  // List users with pagination
  export async function listUsers(page: number = 1, perPage: number = 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: perPage
    });
    if (error) throw error;
    return data;
  }
} 