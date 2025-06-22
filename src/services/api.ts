import axios from 'axios';
import {
  CustomerDraft,
  Customer,
  CustomerUpdate,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { Product } from '@/types/product';

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

export interface SignUpResponse {
  customer: Customer;
}

export interface Category {
  id: string;
  name: Record<string, string>;
  parent?: { id: string };
}

export interface CategoryResponse {
  results: Category[];
}

export interface ProductResponse {
  count: number;
  total: number;
  offset: number;
  limit: number;
  results: Product[];
}

export async function getServiceToken(scopes: string[]): Promise<string> {
  const authHost = import.meta.env.VITE_CT_AUTH_URL;
  const clientId = import.meta.env.VITE_CT_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CT_CLIENT_SECRET;
  const url = `${authHost}/oauth/token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: scopes.join(' '),
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
    throw new Error(err.error_description ?? err.message ?? 'Failed to fetch service token');
  }
  return resp.data.access_token;
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
    throw new Error(errData.error_description ?? 'Login error');
  }
  return resp.data;
};

export async function signUpCustomer(draft: CustomerDraft): Promise<SignUpResponse> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken([`manage_customers:${projectKey}`]);
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

export interface ProductQueryOptions {
  offset?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string[];
  color?: string[];
  size?: string[];
}

export async function getAllProducts(options: ProductQueryOptions = {}): Promise<ProductResponse> {
  const { offset = 0, limit = 20, categoryId, search, sort } = options;

  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken([`view_products:${projectKey}`]);

  const params = new URLSearchParams();
  params.set('offset', String(offset));
  params.set('limit', String(limit));
  if (sort?.startsWith('name.')) params.set('sort', sort);

  const where: string[] = [];
  if (categoryId) where.push(`categories(id="${categoryId}")`);
  if (search?.trim()) {
    const term = search.trim().replace(/"/g, '\\"');
    where.push(`name(en-US contains "${term}")`);
  }
  if (where.length) params.set('where', where.join(' and '));

  const url = `${apiHost}/${projectKey}/product-projections?${params.toString()}`;
  const resp = await axios.get<ProductResponse>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resp.status !== 200) {
    const err = resp.data as unknown as ErrorResponse;
    throw new Error(err.error_description ?? err.message ?? 'Failed to fetch products');
  }
  return resp.data;
}

export async function getAllCategories(): Promise<Category[]> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken([`view_categories:${projectKey}`]);
  const all: Category[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;
  while (hasMore) {
    const url = `${apiHost}/${projectKey}/categories?limit=${limit}&offset=${offset}`;
    const resp = await axios.get<CategoryResponse & { count: number; total: number }>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    all.push(...resp.data.results);
    hasMore = resp.data.results.length === limit;
    offset += limit;
  }
  return all;
}

export async function getProductById(id: string): Promise<Product> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken([`view_products:${projectKey}`]);
  const url = `${apiHost}/${projectKey}/products/${id}`;

  const resp = await axios.get<Product>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (resp.status !== 200) {
    const err = resp.data as unknown as ErrorResponse;
    throw new Error(err.error_description ?? err.message ?? `Failed to fetch product ${id}`);
  }
  return resp.data;
}

export async function getCustomerProfileMe(accessToken: string): Promise<Customer> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;

  const url = `${apiHost}/${projectKey}/me`;

  const resp = await axios.get<Customer>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (resp.status !== 200) {
    const err = resp.data as unknown as ErrorResponse;
    throw new Error(err.error_description ?? err.message ?? 'Failed to fetch customer profile');
  }

  return resp.data;
}

export async function editCustomerActions(
  version: number,
  actions: CustomerUpdateAction[],
): Promise<Customer> {
  const projectKey = import.meta.env.VITE_CT_PROJECT_KEY;
  const apiHost = import.meta.env.VITE_CT_API_URL;
  const token = await getServiceToken([`manage_customers:${projectKey}`]);
  const customerId = localStorage.getItem('id');
  const url = `${apiHost}/${projectKey}/customers/${customerId}`;

  const response = await axios.post<Customer>(
    url,
    { version, actions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status !== 200) {
    const err = response.data as unknown as ErrorResponse;
    throw new Error(err.error_description ?? err.message ?? 'Customer update failed');
  }

  return response.data;
}
