import axios from 'axios';
import {
  CartUpdateAction,
  Customer,
  CustomerDraft,
  CustomerUpdateAction,
  DiscountCode,
  ErrorResponse,
} from '@commercetools/platform-sdk';
import { Product } from '@/types/product';
import { v4 as uuid } from 'uuid';

export interface CustomerTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
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
  results: Product[];
  total: number;
  offset: number;
  limit: number;
}
export interface LineItem {
  id: string;
  productId: string;
  name: Record<string, string>;
  quantity: number;
  price: {
    value: { centAmount: number; currencyCode: string };
    discounted?: { value: { centAmount: number } };
  };
  totalPrice: { centAmount: number; currencyCode: string };
  variant: { id: number; images: { url: string }[] };
}
export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
  totalPrice: { centAmount: number; currencyCode: string };
  discountCodes?: { discountCode: DiscountCode }[];
}

const e = (k: string) => import.meta.env[k];
const basic = `Basic ${btoa(`${e('VITE_CT_CLIENT_ID')}:${e('VITE_CT_CLIENT_SECRET')}`)}`;
const tokenReq = async (p: URLSearchParams) =>
  (
    await axios.post<CustomerTokenResponse>(`${e('VITE_CT_AUTH_URL')}/oauth/token`, p.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: basic },
    })
  ).data.access_token;
export const getServiceToken = async (scopes: string[]) =>
  tokenReq(new URLSearchParams({ grant_type: 'client_credentials', scope: scopes.join(' ') }));
const svc = getServiceToken;
const hdr = async (s: string) => ({ Authorization: `Bearer ${await svc([s])}` });

export const loginCustomer = async (email: string, password: string) =>
  (
    await axios.post<CustomerTokenResponse>(
      `${e('VITE_CT_AUTH_URL')}/oauth/${e('VITE_CT_PROJECT_KEY')}/customers/token`,
      new URLSearchParams({ grant_type: 'password', username: email, password }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: basic } },
    )
  ).data;

export const signUpCustomer = async (draft: CustomerDraft) =>
  (
    await axios.post<{ customer: Customer }>(
      `${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/customers`,
      draft,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await svc([`manage_customers:${e('VITE_CT_PROJECT_KEY')}`])}`,
        },
      },
    )
  ).data;

export const signIn = async (email: string, password: string) => {
  const auth = await loginCustomer(email, password);
  localStorage.setItem('accessToken', auth.access_token);
  const me = await getCustomerProfileMe(auth.access_token);
  localStorage.setItem('id', me.id);
  return auth;
};

export const getAllCategories = async () =>
  (
    await axios.get<CategoryResponse>(
      `${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/categories`,
      { headers: await hdr(`view_categories:${e('VITE_CT_PROJECT_KEY')}`) },
    )
  ).data.results;

export const getAllProducts = async (
  p: { offset?: number; limit?: number; categoryId?: string; sort?: string; search?: string } = {},
) => {
  const { offset = 0, limit = 20, categoryId, sort, search } = p;
  const qs = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  if (sort?.startsWith('name.')) qs.set('sort', sort);
  const where: string[] = [];
  if (categoryId) where.push(`categories(id="${categoryId}")`);
  if (search?.trim()) where.push(`name(en-US contains "${search.trim().replace(/"/g, '\\"')}")`);
  if (where.length) qs.set('where', where.join(' and '));
  return (
    await axios.get<ProductResponse>(
      `${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/product-projections?${qs.toString()}`,
      { headers: await hdr(`view_products:${e('VITE_CT_PROJECT_KEY')}`) },
    )
  ).data;
};

export const getProductById = async (id: string) =>
  (
    await axios.get<Product>(`${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/products/${id}`, {
      headers: await hdr(`view_products:${e('VITE_CT_PROJECT_KEY')}`),
    })
  ).data;

const cartHeaders = async () => ({
  Authorization: `Bearer ${await svc([`manage_orders:${e('VITE_CT_PROJECT_KEY')}`])}`,
  'Content-Type': 'application/json',
});
export const createCart = async (currency: string, country?: string) => {
  const body: Record<string, unknown> = {
    currency,
    anonymousId: localStorage.getItem('anonymous_id') ?? uuid(),
  };
  if (country) body.country = country;
  return (
    await axios.post<Cart>(`${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/carts`, body, {
      headers: await cartHeaders(),
    })
  ).data;
};
export const getCartById = async (id: string) => {
  try {
    return (
      await axios.get<Cart>(`${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/carts/${id}`, {
        headers: await cartHeaders(),
      })
    ).data;
  } catch {
    return null;
  }
};
const cartReq = async (id: string, v: number, actions: CartUpdateAction[]) =>
  (
    await axios.post<Cart>(
      `${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/carts/${id}`,
      { version: v, actions },
      { headers: await cartHeaders() },
    )
  ).data;
export const addLineItem = (id: string, v: number, pid: string, vid: number, q: number) =>
  cartReq(id, v, [{ action: 'addLineItem', productId: pid, variantId: vid, quantity: q }]);
export const changeLineItemQty = (id: string, v: number, lid: string, q: number) =>
  cartReq(id, v, [{ action: 'changeLineItemQuantity', lineItemId: lid, quantity: q }]);
export const removeLineItem = (id: string, v: number, lid: string) =>
  cartReq(id, v, [{ action: 'removeLineItem', lineItemId: lid }]);
export const addDiscountCode = (id: string, v: number, code: string) =>
  cartReq(id, v, [{ action: 'addDiscountCode', code }]);
export const deleteCart = async (id: string, version: number) => {
  await axios.delete(`${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/carts/${id}`, {
    headers: await cartHeaders(),
    params: { version },
  });
};
export const listActiveDiscountCodes = async () =>
  (
    await axios.get<{ results: DiscountCode[] }>(
      `${e('VITE_CT_API_URL')}/${e('VITE_CT_PROJECT_KEY')}/discount-codes?where=isActive="true"`,
      { headers: await hdr(`view_discount_codes:${e('VITE_CT_PROJECT_KEY')}`) },
    )
  ).data.results;

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
    throw new Error(err.message ?? 'Failed to fetch customer profile');
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
    throw new Error(err.message ?? 'Customer update failed');
  }

  return response.data;
}
