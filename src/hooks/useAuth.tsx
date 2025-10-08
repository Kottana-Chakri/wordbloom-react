import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session); // Debug log
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // If user just signed in, navigate to home
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('User signed in, navigating to home'); // Debug log
            navigate("/");
            toast.success("Welcome! You're signed in.");
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session, error); // Debug log
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;

    // Check username availability first to surface friendly errors
    try {
      const { data: existing, error: checkErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1);

      if (checkErr) {
        console.error('Error checking username availability:', checkErr);
        toast.error('Error checking username availability');
        return { error: checkErr };
      }

      if (existing && existing.length > 0) {
        const msg = 'Username already taken. Please choose another.';
        toast.error(msg);
        return { error: new Error(msg) };
      }
    } catch (err) {
      console.error('Unexpected error checking username:', err);
      toast.error('Unexpected error checking username');
      return { error: err };
    }

    // Proceed to create user
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
          },
        },
      });

      if (error) {
        // Surface DB trigger or other errors clearly
        console.error('Sign up error:', error);
        toast.error(error.message || 'Failed to create account');
        return { error };
      }
    } catch (err: any) {
      console.error('Unexpected error during signUp:', err);
      toast.error(err?.message || 'Unexpected error during sign up');
      return { error: err };
    }

    // Try to sign the user in immediately after signup. In some Supabase
    // configs an email confirmation is required; in that case signIn will
    // return an error and we show an informative message.
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Common case: confirmation required or other provider-specific flows.
        toast.success("Account created! Check your email to confirm your account.");
        // Keep on auth page so user can follow instructions
        navigate("/auth");
        return { error: null };
      }

      // Signed in successfully
      toast.success("Account created! You're signed in.");
      navigate("/");
      return { error: null };
    } catch (err: any) {
      console.error('Error signing in after signup:', err);
      toast.success("Account created! Check your email to confirm your account.");
      navigate("/auth");
      return { error: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide clearer feedback for common auth errors
      const msg = error.message || "Invalid credentials";
      toast.error(msg);
      return { error };
    }

    // Confirm we have a session/user after sign in
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        const errMsg = sessionError?.message || "Sign-in completed but session not available";
        console.error('Session check after signIn failed:', sessionError);
        toast.error(errMsg);
        return { error: sessionError || new Error(errMsg) };
      }

      // All good - user is signed in
      toast.success("Welcome back!");
      navigate("/");
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected error after signIn:', err);
      toast.error('Unexpected sign-in error');
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/`;
    
    console.log('Starting Google sign-in with redirect:', redirectUrl); // Debug log
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google sign-in error:', error); // Debug log
      toast.error(error.message);
      return { error };
    }

    // The redirect will happen automatically, so we don't need to do anything here
    console.log('Google OAuth redirect initiated'); // Debug log
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
