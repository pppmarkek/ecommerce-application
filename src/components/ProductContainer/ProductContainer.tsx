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

interface ProductContainerProps {
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
}: ProductContainerProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const original = price / 100;
  const saleMajor = hasDiscount ? discountedPrice! / 100 : undefined;

  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedOriginal = fmt.format(original);
  const formattedSale = hasDiscount ? fmt.format(saleMajor!) : undefined;

  const base = img.split('&format=')[0];
  const avifSrc = `${base}&format=avif`;
  const webpSrc = `${base}&format=webp`;
  const jpegSrc = base;

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(addToCart({ id, title, img, price, currencyCode, smallDescription, discountedPrice }));
  };

  return (
    <Wrapper hasDiscount={hasDiscount} onClick={() => navigate(`/product/${id}`)} ref={ref}>
      {inView && (
        <picture>
          <source type="image/avif" srcSet={avifSrc} />
          <source type="image/webp" srcSet={webpSrc} />
          <ImageContainer src={jpegSrc} alt={title} loading="lazy" width={260} height={250} />
        </picture>
      )}

      <TextWrapper>
        <Title variant="h6" gutterBottom>
          {title}
        </Title>
        <Description variant="body2">{smallDescription}</Description>

        {hasDiscount ? (
          <Grid container alignItems="center" gap="10px">
            <OldPrice variant="subtitle2">{formattedOriginal}</OldPrice>
            <NewPrice variant="subtitle1">{formattedSale}</NewPrice>
          </Grid>
        ) : (
          <Typography variant="subtitle1">{formattedOriginal}</Typography>
        )}
      </TextWrapper>

      <Button onClick={(event) => handleAddToCart(event)}>Add to cart</Button>
    </Wrapper>
  );
});

export default ProductContainer;
