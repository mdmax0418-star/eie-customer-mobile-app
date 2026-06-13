export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(_credentials: LoginCredentials) {
  // TODO: Connect to the EIE customer API authentication endpoint.
  return { token: '' };
}
