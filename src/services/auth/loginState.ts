import { coms, connectSocket, disconnectSocket } from '../../transition/coms';
import { getJwtTokenStorageKey } from '../../config/getJwtTokenStorageKey';
import { browserStorage } from '../../transition/browserStorage';
import { validateToken } from './validateToken';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

export function getLoginState() {
  const token = browserStorage.get(JWT_TOKEN_STORAGE_NAME);
  return validateToken(token);
}
export function logOut() {
  browserStorage.remove(JWT_TOKEN_STORAGE_NAME);
  if (coms.socket) {
    disconnectSocket();
    connectSocket();
  }
}

export function logIn({ data }) {
  const decodedToken = validateToken(data.token);
  if (decodedToken) {
    browserStorage.set(JWT_TOKEN_STORAGE_NAME, data.token);
    disconnectSocket();
    connectSocket();
    console.log({ intent: 'is-success', message: 'Login successful' });
  }
}
