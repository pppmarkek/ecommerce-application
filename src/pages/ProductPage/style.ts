import { styled, Grid } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;

  .alice-carousel {
    position: relative;
    width: 100%;
    margin: auto;
    direction: ltr;
  }

  .alice-carousel__dots {
    margin: 0px 3px 5px;
    display: flex;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing(1)};
  }
  .alice-carousel__next-btn {
    text-align: center;
    border-radius: 5px;
    border: solid 1px #3f3f3f;
    transition: all 0.3s;
  }

  .alice-carousel__next-btn:hover {
    border: solid 1px white;
  }
  .alice-carousel__prev-btn {
    text-align: center;
    border-radius: 5px;
    border: solid 1px #3f3f3f;
    transition: all 0.3s;
  }

  .alice-carousel__prev-btn:hover {
    border: solid 1px white;
  }
`;

export const ProductBox = styled(Grid)`
  width: 80%;
  gap: 20px;
`;

export const ProductBoxTopSide = styled(Grid)`
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

export const ImageContainer = styled('img')`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

export const ProductDescription = styled(Grid)`
  gap: 10px;
`;

export const ImageBox = styled(Grid)`
  width: 20%;
  height: 100%;
  @media (max-width: 1076px) {
    width: 100%;
  }
`;
