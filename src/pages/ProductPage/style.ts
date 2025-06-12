import { styled, Grid, Modal, Button } from '@mui/material';

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

  li.alice-carousel__dots-item.__custom {
    cursor: pointer;
  }

  .alice-carousel__dots {
    margin: 0px 3px 5px;
    display: flex;
    justify-content: center;
    gap: 1px;
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
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

export const ProductDescription = styled(Grid)`
  gap: 10px;
`;

export const ImageBox = styled(Grid)`
  width: 30%;
  @media (max-width: 1076px) {
    width: 100%;
  }
`;

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  &:focus-visible {
    outline: none;
  }
`;

export const ModalImageBox = styled(Grid)`
  width: 30%;
  background-color: rgb(83, 83, 83);
  border-radius: 10px;

  .alice-carousel__dots {
    margin: 0px 3px 5px;
    display: flex;
    justify-content: center;
    gap: 1px;
  }

  li.alice-carousel__dots-item.__custom {
    cursor: pointer;
  }
  .alice-carousel__next-btn {
    text-align: center;
    border-radius: 5px;
    border-radius: 10px;
    transition: all 0.3s;
  }
  .alice-carousel__next-btn:hover {
    background: #3f3f3f;
  }
  .alice-carousel__prev-btn {
    text-align: center;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .alice-carousel__prev-btn:hover {
    background: #3f3f3f;
  }

  @media (max-width: 1260px) {
    width: 50%;
  }

  @media (max-width: 1076px) {
    width: 50%;
  }
  @media (max-width: 700px) {
    width: 90%;
  }
`;

export const CloseModalButton = styled(Button)`
  position: absolute;
  z-index: 2000;
  right: 10px;
  top: 10px;
  color: white;
  width: 15px;
  height: 60px;
  border-radius: 100%;

  :hover {
    background: #3f3f3f;
  }
`;

export const ProductButtonsBox = styled(Grid)`
  max-width: 180px;
  padding-top: 20px;
  flex-wrap: nowrap;
  gap: 10px;
`;

export const QuantityBox = styled(Grid)`
  height: auto;
  max-width: 180px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #818181;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
