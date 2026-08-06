import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, loginWithGoogleRedirect, checkRedirectResult, logoutUser, firebaseInitStatus } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<User | null>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseInitStatus.isValid) {
      console.warn('[DEBUG Auth] Se omite el listener onAuthStateChanged debido a configuración inválida de Firebase:', firebaseInitStatus.errorDetail);
      setError(firebaseInitStatus.errorDetail || 'Configuración de Firebase inválida.');
      setUser(null);
      setLoading(false);
      return;
    }

    // A/B Test: Verificar resultado de getRedirectResult()
    checkRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          setUser(redirectUser);
        }
      })
      .catch((err: any) => {
        console.error('[A/B TEST Redirect Result Error]:', err);
        const errCode = err?.code ? `[${err.code}] ` : '';
        const errMessage = err?.message || String(err);
        setError(`${errCode}${errMessage}`);
      });

    console.log('[DEBUG Auth] Registrando listener onAuthStateChanged...');
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          console.log(`[DEBUG Auth Listener] Usuario activo autenticado: UID="${currentUser.uid}", Email="${currentUser.email}"`);
          setUser(currentUser);
        } else {
          console.log('[DEBUG Auth Listener] No hay usuario activo autenticado.');
          setUser(null);
        }
        setLoading(false);
      },
      (err: any) => {
        console.error('[DEBUG Auth Listener Error] Error en listener Firebase:', err?.code, err?.message || err);
        setError(err?.message || 'Error en autenticación Firebase.');
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLoginGoogle = async (): Promise<User | null> => {
    try {
      setError(null);
      console.log('[DEBUG Auth] Executing Google login flow via Firebase (Popup)...');
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
      }
      return loggedUser;
    } catch (err: any) {
      console.error('[DEBUG Auth Error] Error in Google Auth Login (Raw Object):', err);
      // No modificar ni traducir el error del SDK; almacenar mensaje y código exactos
      const errCode = err?.code ? `[${err.code}] ` : '';
      const errMessage = err?.message || String(err);
      setError(`${errCode}${errMessage}`);
      return null;
    }
  };

  const handleLoginGoogleRedirect = async (): Promise<void> => {
    try {
      setError(null);
      console.log('[A/B TEST] Executing Google login flow via Firebase (Redirect)...');
      await loginWithGoogleRedirect();
    } catch (err: any) {
      console.error('[A/B TEST Auth Error] Error in Google Auth Redirect:', err);
      const errCode = err?.code ? `[${err.code}] ` : '';
      const errMessage = err?.message || String(err);
      setError(`${errCode}${errMessage}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setError(null);
      console.log('[DEBUG Auth] Executing user logout...');
      await logoutUser();
      setUser(null);
    } catch (err: any) {
      console.error('[DEBUG Auth Error] Error in Logout:', err?.code, err?.message || String(err));
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithGoogle: handleLoginGoogle,
        loginWithGoogleRedirect: handleLoginGoogleRedirect,
        logout: handleLogout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
