import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '../utils/supabaseClient'; // Adjust the path as needed
import { baseUrl } from '../configs/NetworkConfig';

type UserType = {
  id: string;
  email?: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  signOut: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }
      setUser(data?.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}`,
        },
      });
      if (error) {
        console.error('Error logging in with Google:', error.message);
      } else {
        console.log('Redirecting for Google authentication', data);
      }
    } catch (error) {
      console.error('Unexpected error during Google Sign-In:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, signOut, handleGoogleSignIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
