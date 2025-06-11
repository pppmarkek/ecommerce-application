import React from 'react';
import { Grid, Typography } from '@mui/material';
import {
  Wrapper,
  ImageContainer,
  TextWrapper,
  Description,
  Title,
  OldPrice,
  NewPrice,
} from './style';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Button } from '../Button/Button';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

interface Props {
  id: string;
  title: string;
  img: string;
  price: number;
  currencyCode: string;
  smallDescription: string;
  discountedPrice?: number;
}

const ProductContainer = React.memo(function ProductContainer({
  id,
  title,
  img,
  price,
  currencyCode,
  smallDescription,
  discountedPrice,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  });
  const original = fmt.format(price / 100);
  const sale = hasDiscount ? fmt.format(discountedPrice! / 100) : '';
  const base = img.split('&format=')[0];
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ productId: id }));
  };
  return (
    <Wrapper hasDiscount={hasDiscount} onClick={() => navigate(`/product/${id}`)} ref={ref}>
      {inView && (
        <picture>
          <source type="image/avif" srcSet={`${base}&format=avif`} />
          <source type="image/webp" srcSet={`${base}&format=webp`} />
          <ImageContainer src={base} alt={title} loading="lazy" width={260} height={250} />
        </picture>
      )}
      <TextWrapper>
        <Title variant="h6" gutterBottom>
          {title}
        </Title>
        <Description variant="body2">{smallDescription}</Description>
        {hasDiscount ? (
          <Grid container alignItems="center" gap="10px">
            <OldPrice variant="subtitle2">{original}</OldPrice>
            <NewPrice variant="subtitle1">{sale}</NewPrice>
          </Grid>
        ) : (
          <Typography variant="subtitle1">{original}</Typography>
        )}
      </TextWrapper>
      <Button onClick={handleAdd}>Add to cart</Button>
    </Wrapper>
  );
});
export default ProductContainer;
