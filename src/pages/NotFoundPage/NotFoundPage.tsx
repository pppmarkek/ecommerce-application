import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#fff"
    >
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" sx={{ color: '#000' }}>
        Nice try but...{' '}
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/login')}
          underline="hover"
        >
          GO BACK
        </Link>
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
