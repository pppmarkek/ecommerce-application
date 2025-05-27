import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('login');
  };

  return (
    <Grid>
      <Button onClick={() => navigate('/')}>HomePage</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </Grid>
  );
};
