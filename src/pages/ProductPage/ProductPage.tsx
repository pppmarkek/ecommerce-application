import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Grid } from '@mui/material';
import {
  Wrapper,
  ProductBox,
  ProductBoxTopSide,
  ImageContainer,
  ProductDescription,
  ImageBox,
  ModalImageBox,
  StyledModal,
  CloseModalButton,
  ProductButtonsBox,
} from './style';
import { getProductById } from '../../services/api';
import { Product } from '@/types/product';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Button } from '../../components/Button/Button';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [inCart, setInCart] = useState(false);
  const handleOpen = (idx: number) => {
    setInitialSlide(idx);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const locale = 'en-US';

  const addtoCard = () => {
    setInCart(true);
  };
  const removeFromeCard = () => {
    setInCart(false);
  };

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
      <Wrapper container>
        <CircularProgress />
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper container>
        <Typography color="error">{error || 'Product not found.'}</Typography>
      </Wrapper>
    );
  }

  const {
    name,
    description,
    masterVariant: { images, prices },
  } = product.masterData.current;

  const imagesArray = images.map((img, idx) => (
    <Grid key={idx} onClick={() => handleOpen(idx)}>
      <ImageContainer src={img.url} alt={img.label ?? name[locale]} />
    </Grid>
  ));

  const renderDotsItem = ({ isActive }: { isActive?: boolean }): React.ReactNode =>
    isActive ? 'x' : 'o';

  const renderPrevButton = ({ isDisabled }: { isDisabled?: boolean }): React.ReactNode => (
    <span style={{ opacity: isDisabled ? 0.5 : 1 }}>Prev</span>
  );

  const renderNextButton = ({ isDisabled }: { isDisabled?: boolean }): React.ReactNode => (
    <span style={{ opacity: isDisabled ? 0.5 : 1 }}>Next</span>
  );

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
          <ImageBox>
            <AliceCarousel
              mouseTracking
              items={imagesArray}
              renderDotsItem={renderDotsItem}
              renderPrevButton={renderPrevButton}
              renderNextButton={renderNextButton}
            />
          </ImageBox>
          <Grid>
            <Typography variant="h4" sx={{ wordBreak: 'break-word' }}>
              {name[locale]}
            </Typography>
            <Grid>
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
            <ProductButtonsBox container>
              <Button onClick={addtoCard} disabled={inCart}>
                Add
              </Button>
              <Button onClick={removeFromeCard} disabled={!inCart}>
                Remove
              </Button>
            </ProductButtonsBox>
          </Grid>
        </ProductBoxTopSide>
        <ProductDescription container>
          <Typography variant="h4">Description</Typography>
          <Typography variant="body1">{description[locale]}</Typography>
        </ProductDescription>
      </ProductBox>
      <StyledModal open={open} onClose={handleClose} disableAutoFocus>
        <ModalImageBox>
          <CloseModalButton onClick={handleClose}>X</CloseModalButton>
          <AliceCarousel
            mouseTracking
            items={imagesArray}
            renderDotsItem={renderDotsItem}
            renderPrevButton={renderPrevButton}
            renderNextButton={renderNextButton}
            activeIndex={initialSlide}
          />
        </ModalImageBox>
      </StyledModal>
    </Wrapper>
  );
}
