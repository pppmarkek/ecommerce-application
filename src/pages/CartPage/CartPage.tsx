import { JSX } from 'react';
import {
  AllItems,
  Description,
  Item,
  QuantityBox,
  StyledImage,
  Title,
  Wrapper,
  OldPrice,
  NewPrice,
} from './style';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { addQuantity, removeFromCart, removeQuantity } from '@/store/cartSlice';
import { Button } from '@/components/Button/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage(): JSX.Element {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleAddQuantity = (event: React.MouseEvent, itemId: string) => {
    event.stopPropagation();
    dispatch(addQuantity(itemId));
  };
  const handleRemoveQuantity = (event: React.MouseEvent, itemId: string) => {
    event.stopPropagation();
    dispatch(removeQuantity(itemId));
  };
  const handleRemoveItem = (event: React.MouseEvent, itemId: string) => {
    event.stopPropagation();
    dispatch(removeFromCart(itemId));
  };

  return (
    <Wrapper container>
      {cart.length === 0 ? (
        <Grid container flexDirection="column" alignItems="center" gap="20px">
          <h2>Your cart is currently empty.</h2>
          <Link to="/">Add products</Link>
        </Grid>
      ) : (
        <AllItems container>
          {cart.map((item) => {
            const unitPrice = item.discountedPrice ?? item.price;
            const original = item.price / 100;
            const sale = (unitPrice / 100).toFixed(2);
            const formattedOriginal = `${item.currencyCode} ${original.toFixed(2)}`;
            const hasDiscount =
              item.discountedPrice !== undefined && item.discountedPrice < item.price;

            return (
              <Item key={item.id} onClick={() => navigate(`/product/${item.id}`)} container>
                <StyledImage src={item.img} alt={item.title} />
                <Title variant="h5">{item.title}</Title>
                <Description variant="body1">{item.smallDescription}</Description>

                <Typography>
                  <QuantityBox container>
                    <IconButton onClick={(event) => handleRemoveQuantity(event, item.id)}>
                      <RemoveIcon />
                    </IconButton>
                    {item.quantity}
                    <IconButton onClick={(event) => handleAddQuantity(event, item.id)}>
                      <AddIcon />
                    </IconButton>
                  </QuantityBox>
                </Typography>

                {hasDiscount ? (
                  <Grid container alignItems="center" gap="10px">
                    <OldPrice variant="body2">{formattedOriginal}</OldPrice>
                    <NewPrice variant="body1">
                      {item.currencyCode} {sale}
                    </NewPrice>
                  </Grid>
                ) : (
                  <Typography>
                    {item.currencyCode} {((unitPrice * item.quantity) / 100).toFixed(2)}
                  </Typography>
                )}

                <Button width="60px" onClick={(event) => handleRemoveItem(event, item.id)}>
                  <DeleteIcon />
                </Button>
              </Item>
            );
          })}

          <Item noHover container>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              Total:
            </Typography>
            <Typography variant="h6">
              {cart[0].currencyCode}{' '}
              {cart
                .reduce((sum, item) => {
                  const unit = item.discountedPrice ?? item.price;
                  return sum + (unit * item.quantity) / 100;
                }, 0)
                .toFixed(2)}
            </Typography>
          </Item>
        </AllItems>
      )}
    </Wrapper>
  );
}
