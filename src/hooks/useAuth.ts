import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then((response: { data: { session: Session | null } }) => {
      const session = response.data.session;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully!');
      return { user: data.user, session: data.session };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      let userFriendlyMessage = errorMessage;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Invalid email or password. Please check your credentials.';
      } else if (errorMessage.includes('Email not confirmed')) {
        userFriendlyMessage = 'Please check your email and click the verification link.';
      } else if (errorMessage.includes('Too many requests')) {
        userFriendlyMessage = 'Too many login attempts. Please try again later.';
      } else if (errorMessage.includes('Supabase not configured')) {
        userFriendlyMessage = 'Authentication service not configured. Please check setup.';
      }
      
      toast.error(userFriendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Signed out successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Account created! Check your email for verification link.');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { user: data.user, session: data.session };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      let userFriendlyMessage = errorMessage;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('User already registered')) {
        userFriendlyMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (errorMessage.includes('Password should be at least')) {
        userFriendlyMessage = 'Password must be at least 6 characters long.';
      } else if (errorMessage.includes('Invalid email')) {
        userFriendlyMessage = 'Please enter a valid email address.';
      } else if (errorMessage.includes('Signup is disabled')) {
        userFriendlyMessage = 'Account creation is currently disabled. Please contact support.';
      }
      
      toast.error(userFriendlyMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      let userFriendlyMessage = errorMessage;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('Invalid email')) {
        userFriendlyMessage = 'Please enter a valid email address.';
      } else if (errorMessage.includes('User not found')) {
        userFriendlyMessage = 'No account found with this email address.';
      }
      
      toast.error(userFriendlyMessage);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword,
  };
};
