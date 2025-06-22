import { styled } from '@mui/material';

export const PageLayout = styled('div')`
  display: flex;
  height: 100%;
`;

export const Sidebar = styled('aside')`
  width: 240px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  padding: 16px;
  overflow-y: auto;
`;

export const Content = styled('main')`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px 24px 40px;
`;

export const ProductGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
  padding-top: 24px;
`;
