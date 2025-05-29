import { supabase } from '../lib/supabase';
import { User } from '../types/User';

// Login user
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (!data.session) throw new Error('No session returned');

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profile.full_name || profile.name || 'User',
        joinDate: data.user.created_at,
        workoutStreak: 0,
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        createdAt: data.user.created_at,
        updatedAt: profile.updated_at,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to login');
  }
};

// Register new user
export const registerUser = async (
  userData: Partial<User> & { email: string; password: string }
): Promise<{ token: string; user: User }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('No session returned');

    // Create user profile
    const { error: profileError } = await supabase.from('user_profiles').insert({
      user_id: data.user.id,
      full_name: userData.name,
      created_at: new Date().toISOString(),
    });

    if (profileError) throw new Error(profileError.message);

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: userData.email,
        name: userData.name || 'User',
        joinDate: data.user.created_at,
        workoutStreak: 0,
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to register');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw new Error(error.message);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset password email');
  }
};

// Get user profile
export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw new Error(userError.message);
    if (!user) throw new Error('No user found');

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    return {
      id: user.id,
      email: user.email!,
      name: profile.full_name || profile.name || 'User',
      joinDate: user.created_at,
      workoutStreak: 0,
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      createdAt: user.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};