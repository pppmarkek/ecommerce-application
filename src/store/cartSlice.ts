import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import {
  Cart,
  getCartById,
  createCart,
  addLineItem,
  changeLineItemQty,
  removeLineItem,
  getProductById,
  addDiscountCode,
  deleteCart,
  setCartCountry,
} from '@/services/api';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  img: string;
  price: number;
  currencyCode: string;
  quantity: number;
  discountedPrice?: number;
}
interface State {
  id: string;
  version: number;
  currencyCode: string;
  total: number;
  original: number;
  items: CartItem[];
  loading: boolean;
  country?: string;
}
const initial: State = {
  id: '',
  version: 0,
  currencyCode: '',
  total: 0,
  original: 0,
  items: [],
  loading: false,
};

const mapCart = (c: Cart): State => {
  const original = c.lineItems.reduce((s, l) => s + l.price.value.centAmount * l.quantity, 0);
  return {
    id: c.id,
    version: c.version,
    currencyCode: c.totalPrice.currencyCode,
    country: (c as Cart & { country?: string }).country ?? undefined,
    total: c.totalPrice.centAmount,
    original,
    loading: false,
    items: c.lineItems.map((l) => ({
      id: l.id,
      productId: l.productId,
      title: l.name['en-US'] ?? '',
      img: l.variant.images?.[0]?.url ?? '',
      price: l.price.discounted?.value.centAmount ?? l.price.value.centAmount,
      currencyCode: l.price.value.currencyCode,
      quantity: l.quantity,
      discountedPrice: l.price.discounted?.value.centAmount,
    })),
  };
};
const loadId = () => localStorage.getItem('cart_id') ?? '';
const saveId = (id: string) => localStorage.setItem('cart_id', id);

export const fetchCart = createAsyncThunk<State>('cart/fetch', async () => {
  const stored = loadId();
  let cart = stored ? await getCartById(stored) : null;
  if (!cart) cart = await createCart('USD');
  saveId(cart.id);
  return mapCart(cart);
});

export const addToCart = createAsyncThunk<
  State,
  { productId: string; qty?: number },
  { state: RootState }
>('cart/add', async ({ productId, qty = 1 }, { getState }) => {
  const prod = await getProductById(productId);
  const variant = prod.masterData.current.masterVariant;

  const price = variant.prices?.find((p) => p.country) ?? variant.prices?.[0];
  if (!price) throw new Error('Price not found');
  const cur = price.value.currencyCode;
  const needCountry = price.country;

  const { id, version, currencyCode, country } = getState().cart;

  if (!id) {
    const c = await createCart(cur, needCountry);
    saveId(c.id);
    return mapCart(await addLineItem(c.id, c.version, productId, variant.id, qty));
  }

  if (currencyCode !== cur) {
    const c = await createCart(cur, needCountry);
    saveId(c.id);
    return mapCart(await addLineItem(c.id, c.version, productId, variant.id, qty));
  }

  if (needCountry && needCountry !== country) {
    const fixed = await setCartCountry(id, version, needCountry);
    return mapCart(await addLineItem(fixed.id, fixed.version, productId, variant.id, qty));
  }

  const updated = await addLineItem(id, version, productId, variant.id, qty);
  return mapCart(updated);
});

export const changeQty = createAsyncThunk<
  State,
  { lineItemId: string; qty: number },
  { state: RootState }
>('cart/qty', async ({ lineItemId, qty }, { getState }) =>
  mapCart(await changeLineItemQty(getState().cart.id, getState().cart.version, lineItemId, qty)),
);

export const removeItem = createAsyncThunk<State, { lineItemId: string }, { state: RootState }>(
  'cart/rm',
  async ({ lineItemId }, { getState }) =>
    mapCart(await removeLineItem(getState().cart.id, getState().cart.version, lineItemId)),
);

export const applyCode = createAsyncThunk<State, string, { state: RootState }>(
  'cart/applyCode',
  async (promoCodeValue, { getState }) => {
    const { id, version } = getState().cart;
    const updated = await addDiscountCode(id, version, promoCodeValue);
    return mapCart(updated);
  },
);
export const clearCart = createAsyncThunk<State, void, { state: RootState }>(
  'cart/clear',
  async (_, { getState }) => {
    const { id, version, currencyCode, country } = getState().cart;
    if (id) {
      await deleteCart(id, version);
    }
    const c = await createCart(currencyCode || 'USD', country);
    saveId(c.id);
    return mapCart(c);
  },
);

const slice = createSlice({
  name: 'cart',
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCart.fulfilled, (_, a) => a.payload)
      .addCase(addToCart.fulfilled, (_, a) => a.payload)
      .addCase(changeQty.fulfilled, (_, a) => a.payload)
      .addCase(removeItem.fulfilled, (_, a) => a.payload)
      .addCase(applyCode.fulfilled, (_, a) => a.payload)
      .addCase(clearCart.fulfilled, (_, a) => a.payload);
  },
});

export const selectCart = (s: RootState) => s.cart ?? initial;
export default slice.reducer;
