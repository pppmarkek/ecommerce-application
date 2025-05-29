import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Wrapper, ProductBox, ProductBoxTopSide } from './style';
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

  const { name, description, masterVariant } = product.masterData.current;
  const images = masterVariant.images;

  return (
    <Wrapper>
      <ProductBox container>
        <ProductBoxTopSide>
          <Box>
            {images.map((img, idx) => (
              <Box key={idx}>
                <img
                  src={img.url}
                  alt={img.label ?? name[locale]}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Box>
            ))}
          </Box>

          <Box>
            <Typography variant="h4" gutterBottom>
              {name[locale]}
            </Typography>
          </Box>
        </ProductBoxTopSide>
        <Box>
          <Typography variant="h4">Description</Typography>
          <Typography variant="body1">{description[locale]}</Typography>
        </Box>
      </ProductBox>
    </Wrapper>
  );
}
