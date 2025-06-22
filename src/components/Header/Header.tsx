import { Button } from '../Button/Button';
import { HeaderContainer, StyledImage, ButtonWrapper } from './style';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('login');
  };

  const handleProfile = () => {
    navigate('/profile');
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
        <Button width="100px" onClick={handleProfile}>
          Profile
        </Button>
        <Button width="100px" onClick={handleLogout}>
          Logout
        </Button>
      </ButtonWrapper>
    </HeaderContainer>
  );
}
