// User types
export interface User {
  id: string;
  username: string;
  createdAt: number;
}

// Stored User includes password
interface StoredUser extends User {
  password: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Default auth state
export const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Get auth state from localStorage
export const getAuthState = (): AuthState => {
  if (typeof window === "undefined") return defaultAuthState;

  const authData = localStorage.getItem("auth");
  if (!authData) return defaultAuthState;

  try {
    return JSON.parse(authData);
  } catch (error) {
    console.error("Failed to parse auth data", error);
    return defaultAuthState;
  }
};

// Save auth state to localStorage
export const saveAuthState = (authState: AuthState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth", JSON.stringify(authState));
};

// Get all registered users
const getUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return [];

  const usersData = localStorage.getItem("users");
  if (!usersData) return [];

  try {
    return JSON.parse(usersData);
  } catch (error) {
    console.error("Failed to parse users data", error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("users", JSON.stringify(users));
};

// Find user by username
const findUserByUsername = (username: string): StoredUser | undefined => {
  const users = getUsers();
  return users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
};

// Login function
export const login = (username: string, password: string): User | null => {
  // Find the user in registered users
  const storedUser = findUserByUsername(username);

  if (storedUser && storedUser.password === password) {
    // Return user without password
    const { id, username, createdAt } = storedUser;
    const user: User = { id, username, createdAt };

    const authState: AuthState = {
      user,
      isAuthenticated: true,
    };

    saveAuthState(authState);
    return user;
  }

  return null;
};

// Register function
export const register = (username: string, password: string): User | null => {
  // Check if username already exists
  if (findUserByUsername(username)) {
    return null; // Username already taken
  }

  // Create new user
  const newUser: StoredUser = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: Date.now(),
  };

  // Add to users storage
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  // Create an auth state without the password
  const { id, username: name, createdAt } = newUser;
  const user: User = { id, username: name, createdAt };

  const authState: AuthState = {
    user,
    isAuthenticated: true,
  };

  saveAuthState(authState);
  return user;
};

// Logout function
export const logout = (): void => {
  saveAuthState(defaultAuthState);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getAuthState().user;
};
