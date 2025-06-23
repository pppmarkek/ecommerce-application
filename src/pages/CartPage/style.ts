import { Grid, styled, Typography } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 93px);
  padding: 20px;
  gap: 20px;
`;

export const AllItems = styled(Grid)`
  width: 60%;
  border-radius: 10px;
  border: 1px solid #818181;
  padding: 20px;
  gap: 20px;
`;

export const Item = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'noHover',
})<{ noHover?: boolean }>(({ noHover }) => ({
  borderBottom: '1px solid #818181',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '10px',
  width: '100%',
  transition: 'all 0.3s',
  cursor: noHover ? 'default' : 'pointer',
  '&:hover': noHover
    ? {}
    : {
        borderColor: 'rgb(202, 202, 202)',
      },
}));
export const StyledImage = styled('img')`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 5px;
`;

export const Description = styled(Typography)`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: start;
  overflow: hidden;
  width: 150px;
`;

export const Title = styled(Typography)`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: start;
  overflow: hidden;
  width: 300px;
`;

export const QuantityBox = styled(Grid)`
  height: auto;
  width: auto;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #818181;
  align-items: center;
  gap: 10px;
`;

export const OldPrice = styled(Typography)`
  text-decoration: line-through;
  color: #888;
`;

export const NewPrice = styled(Typography)`
  color: #d32f2f;
  font-weight: bold;
`;
