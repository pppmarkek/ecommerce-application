import axios from 'axios';

export interface CustomerTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface ErrorResponse {
  error_description?: string;
}

export const loginCustomer = async (
  email: string,
  password: string,
): Promise<CustomerTokenResponse> => {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const authHost = import.meta.env.VITE_CT_AUTH_URL;
  const clientId = import.meta.env.VITE_CT_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CT_CLIENT_SECRET;

  const url = `${authHost}/oauth/${projectKey}/customers/token`;

  const params = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password,
  });

  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const resp = await axios.post<CustomerTokenResponse>(url, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
  });

  if (resp.status !== 200) {
    const errData = resp.data as unknown as ErrorResponse;
    const errDesc = errData.error_description;
    throw new Error(errDesc ?? 'Login error');
  }

  return resp.data;
};
