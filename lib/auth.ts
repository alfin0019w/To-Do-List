export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export const authService = {
  login: (email: string, password: string): User | null => {
    if (typeof window === 'undefined') return null;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  },

  register: (email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): User | null => {
    if (typeof window === 'undefined') return null;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      return null;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('currentUser');
  }
};
