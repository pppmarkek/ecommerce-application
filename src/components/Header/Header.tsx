import { Button } from '../Button/Button';
import { HeaderContainer, StyledImage, ButtonWrapper } from './style';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { clearCart } from '@/store/cartSlice';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearCart());
    navigate('login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleAbout = () => {
    navigate('/aboutUs');
  };

  return (
    <HeaderContainer>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <StyledImage src="/headerIcon.png" alt="Icon" />
      </button>

      <ButtonWrapper>
        <Button width="110px" onClick={handleAbout}>
          About Us
        </Button>
        <Button width="100px" onClick={handleProfile}>
          Profile
        </Button>
        <Button width="100px" onClick={handleLogout}>
          Logout
        </Button>
        <Button width="auto" onClick={() => navigate('/cart')}>
          <ShoppingCartIcon />
        </Button>
      </ButtonWrapper>
    </HeaderContainer>
  );
}
