import jwtDecode from 'jwt-decode';

export function saveToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role ?? null;
  } catch {
    return null;
  }
}
