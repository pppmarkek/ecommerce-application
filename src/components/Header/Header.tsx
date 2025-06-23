import { Button } from '../Button/Button';
import { HeaderContainer, StyledImage, ButtonWrapper, CartCount } from './style';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { clearCart, selectCart } from '@/store/cartSlice';
import { AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);

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
          <CartCount>{cart.items.length >= 9 ? '9+' : cart.items.length}</CartCount>
          <ShoppingCartIcon />
        </Button>
      </ButtonWrapper>
    </HeaderContainer>
  );
}
