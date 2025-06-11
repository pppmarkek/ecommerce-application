import { JSX, useEffect, useState } from 'react';
import {
  Wrapper,
  AllItems,
  Item,
  StyledImage,
  Title,
  Description,
  QuantityBox,
  OldPrice,
  NewPrice,
} from './style';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@/components/Button/Button';
import {
  selectCart,
  fetchCart,
  changeQty,
  removeItem,
  applyCode,
  clearCart,
} from '@/store/cartSlice';
import { AppDispatch } from '@/store';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/Input/Input';

export default function CartPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);

  const [code, setCode] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const inc = (e: React.MouseEvent, id: string, q: number) => {
    e.stopPropagation();
    dispatch(changeQty({ lineItemId: id, qty: q + 1 }));
  };

  const dec = (e: React.MouseEvent, id: string, q: number) => {
    e.stopPropagation();
    if (q > 1) {
      dispatch(changeQty({ lineItemId: id, qty: q - 1 }));
    } else {
      dispatch(removeItem({ lineItemId: id }));
    }
  };

  const del = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeItem({ lineItemId: id }));
  };

  const apply = () => {
    const trimmed = code.trim();
    if (trimmed) {
      dispatch(applyCode(trimmed));
      setCode('');
    }
  };

  const confirmClear = () => {
    if (window.confirm('Clear entire cart?')) {
      dispatch(clearCart());
    }
  };

  if (cart.loading) return <Typography>Loading…</Typography>;

  return (
    <Wrapper container>
      {cart.items.length === 0 ? (
        <Grid container direction="column" alignItems="center" gap={2}>
          <h2>Your cart is currently empty.</h2>
          <Link to="/">Add products</Link>
        </Grid>
      ) : (
        <AllItems container>
          {cart.items.map((i) => {
            const unit = i.discountedPrice ?? i.price;
            const hasDiscount = i.discountedPrice !== undefined && i.discountedPrice < i.price;

            return (
              <Item key={i.id} container onClick={() => navigate(`/product/${i.productId}`)}>
                <StyledImage src={i.img} alt={i.title} />
                <Title variant="h6">{i.title}</Title>
                <Description variant="body2" />
                <QuantityBox container>
                  <IconButton onClick={(e) => dec(e, i.id, i.quantity)}>
                    <RemoveIcon />
                  </IconButton>
                  {i.quantity}
                  <IconButton onClick={(e) => inc(e, i.id, i.quantity)}>
                    <AddIcon />
                  </IconButton>
                </QuantityBox>
                {hasDiscount ? (
                  <Grid container gap={1} alignItems="center">
                    <OldPrice variant="body2">
                      {i.currencyCode} {(i.price / 100).toFixed(2)}
                    </OldPrice>
                    <NewPrice variant="body1">
                      {i.currencyCode} {(unit / 100).toFixed(2)}
                    </NewPrice>
                  </Grid>
                ) : (
                  <Typography>
                    {i.currencyCode} {((unit * i.quantity) / 100).toFixed(2)}
                  </Typography>
                )}
                <Button width="50px" onClick={(e) => del(e, i.id)}>
                  <DeleteIcon />
                </Button>
              </Item>
            );
          })}

          <Grid container width="100%" justifyContent="space-between" alignItems="center">
            {cart.original !== cart.total && (
              <Grid container gap={2} alignItems="center">
                <OldPrice variant="h6">
                  {cart.currencyCode} {(cart.original / 100).toFixed(2)}
                </OldPrice>
                <NewPrice variant="h5">
                  {cart.currencyCode} {(cart.total / 100).toFixed(2)}
                </NewPrice>
              </Grid>
            )}
            {cart.original === cart.total && (
              <Typography variant="h5">
                {cart.currencyCode} {(cart.total / 100).toFixed(2)}
              </Typography>
            )}

            <Grid container gap={1} alignItems="center">
              <Input
                width="200px"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Promo code"
              />
              <Button onClick={apply} width="80px" height="40px">
                Apply
              </Button>
              <Button onClick={confirmClear} width="110px" height="40px">
                Clear cart
              </Button>
            </Grid>
          </Grid>
        </AllItems>
      )}
    </Wrapper>
  );
}
