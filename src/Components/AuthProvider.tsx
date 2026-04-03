import { createContext, useContext, type FormEvent, type ReactNode, useMemo, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  currentUser: string | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({ currentUser: null, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

const ALLOWED_USERS: Record<string, string> = {
  user1: "password1",
  user2: "password2",
  user3: "password3",
};

const AUTH_STORAGE_KEY = "authenticatedUser";

const getStoredUser = (): string | null => {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (storedUser && storedUser in ALLOWED_USERS) {
    return storedUser;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(() => getStoredUser());
  const [error, setError] = useState("");

  const canLogin = useMemo(() => username.length > 0 && password.length > 0, [username, password]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ALLOWED_USERS[username] === password) {
      setCurrentUser(username);
      localStorage.setItem(AUTH_STORAGE_KEY, username);
      setError("");
      return;
    }

    setError("Invalid username or password.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUsername("");
    setPassword("");
    setError("");
  };

  if (currentUser) {
    return (
      <AuthContext.Provider value={{ currentUser, logout: handleLogout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <img src="/Logo_Nebest_transparant.png" alt="Nebest" className="auth-logo" />
          <span className="auth-brand-text">Workspace</span>
        </div>

        <div className="auth-divider" />

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="username" className="auth-label">Gebruikersnaam</label>
            <input
              id="username"
              name="username"
              className="auth-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Vul je gebruikersnaam in"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">Wachtwoord</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Vul je wachtwoord in"
            />
          </div>

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="auth-submit" disabled={!canLogin}>
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthProvider;