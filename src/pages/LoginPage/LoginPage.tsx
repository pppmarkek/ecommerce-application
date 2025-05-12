import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginBox, Wrapper } from './style';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { loginCustomer } from '@/services/api';
import { useDispatch } from 'react-redux';
import { fetchMe } from '@/store/userSlice';
import { AppDispatch } from '@/store';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; login?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format.';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain a digit.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      setErrors({});
      const { access_token, refresh_token } = await loginCustomer(email, password);
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      await dispatch(fetchMe()).unwrap();
      navigate('/');
    } catch (err) {
      setErrors({
        login:
          err instanceof Error &&
          'response' in err &&
          (err.response as { data?: { error_description?: string } })?.data?.error_description
            ? (err.response as { data?: { error_description?: string } })?.data?.error_description
            : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Wrapper container>
      <form onSubmit={handleSubmit} noValidate>
        <LoginBox container>
          <Grid>
            <Typography variant="h4">Login</Typography>
            <Typography variant="inherit" color="error" minHeight="20px" width={'100%'}>
              {errors.login}
            </Typography>
          </Grid>

          <Grid container direction="column" alignItems="flex-start" width={'100%'}>
            <Typography variant="subtitle1">Email</Typography>
            <Input
              name="email"
              placeholder="Write your email..."
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
              }}
            />
            <Typography variant="inherit" color="error" height="20px">
              {errors.email}
            </Typography>
          </Grid>

          <Grid container direction="column" alignItems="flex-start" width={'100%'}>
            <Typography variant="subtitle1">Password</Typography>
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                name="password"
                placeholder="Write your password..."
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
                }}
                padding="0 40px 0 0"
              />
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <Typography variant="inherit" color="error" height="20px">
              {errors.password}
            </Typography>
          </Grid>

          <Grid container width={'100%'} gap={'5px'}>
            <Button width="100%" type="submit">
              Login
            </Button>
            <Link to={'/signup'}>Registration</Link>
          </Grid>
        </LoginBox>
      </form>
    </Wrapper>
  );
};
