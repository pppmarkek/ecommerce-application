import { Button } from '../Button/Button';
import { HeaderContainer, StyledImage } from './style';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('login');
  };

  return (
    <HeaderContainer>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <StyledImage src="/headerIcon.png" alt="Icon" />
      </button>
      <Button onClick={handleLogout} width="100px">
        Logout
      </Button>
    </HeaderContainer>
  );
}
