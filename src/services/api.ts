import axios from 'axios';
import { CustomerDraft, Customer } from '@commercetools/platform-sdk';

export interface CustomerTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
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

export async function getServiceToken(): Promise<string> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const authHost = import.meta.env.VITE_CT_AUTH_URL;
  const clientId = import.meta.env.VITE_CT_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CT_CLIENT_SECRET;

  const url = `${authHost}/oauth/token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: `manage_customers:${projectKey}`,
  });
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const resp = await axios.post<CustomerTokenResponse>(url, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
  });

  if (resp.status !== 200) {
    const err = resp.data as unknown as ErrorResponse;
    throw new Error(err.error_description ?? err.message ?? 'Failed to fetch token');
  }

  return resp.data.access_token;
}

export interface SignUpResponse {
  customer: Customer;
}

export async function signUpCustomer(draft: CustomerDraft): Promise<SignUpResponse> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken();

  const url = `${apiHost}/${projectKey}/customers`;

  const resp = await axios.post<SignUpResponse>(url, draft, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (resp.status !== 201) {
    const errData = resp.data as unknown as ErrorResponse;
    throw new Error(errData.error_description ?? errData.message ?? 'Customer sign-up failed');
  }

  return resp.data;
}
