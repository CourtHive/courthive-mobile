import { jwtDecode } from 'jwt-decode';

export function validateToken(token) {
  if (!token || token === 'undefined') {
    return undefined;
  }

  const decodedToken = jwtDecode(token);
  const dateNow = new Date();

  const tokenExpired = decodedToken?.exp < dateNow.getTime() / 1000;
  if (tokenExpired) return undefined;

  return decodedToken;
}
