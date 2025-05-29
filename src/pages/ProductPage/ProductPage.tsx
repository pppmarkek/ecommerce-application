import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Grid } from '@mui/material';
import {
  Wrapper,
  ProductBox,
  ProductBoxTopSide,
  ImageContainer,
  ProductDescription,
} from './style';
import { getProductById } from '../../services/api';
import { Product } from '@/types/product';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = 'en-US';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((p) => {
        setProduct(p);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper>
        <Typography color="error">{error || 'Product not found.'}</Typography>
      </Wrapper>
    );
  }

  const {
    name,
    description,
    masterVariant: { images, prices },
  } = product.masterData.current;

  const priceEntry = prices[0];
  const original = priceEntry.value.centAmount / 100;
  const hasSale = Boolean(priceEntry.discounted);
  const sale = hasSale ? priceEntry.discounted!.value.centAmount / 100 : undefined;

  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: priceEntry.value.currencyCode,
    minimumFractionDigits: 2,
  });

  return (
    <Wrapper container>
      <ProductBox container>
        <ProductBoxTopSide container>
          <Grid>
            {images.map((img, idx) => (
              <Grid key={idx}>
                <ImageContainer src={img.url} alt={img.label ?? name[locale]} />
              </Grid>
            ))}
          </Grid>
          <Grid>
            <Typography variant="h4" gutterBottom>
              {name[locale]}
            </Typography>
            <Typography
              variant={hasSale ? 'subtitle1' : 'h5'}
              sx={{ textDecoration: hasSale ? 'line-through' : 'none' }}
            >
              {fmt.format(original)}
            </Typography>

            {hasSale && (
              <Typography variant="h5" color="error">
                {fmt.format(sale!)}
              </Typography>
            )}
          </Grid>
        </ProductBoxTopSide>
        <ProductDescription container>
          <Typography variant="h4">Description</Typography>
          <Typography variant="body1">{description[locale]}</Typography>
        </ProductDescription>
      </ProductBox>
    </Wrapper>
  );
}
