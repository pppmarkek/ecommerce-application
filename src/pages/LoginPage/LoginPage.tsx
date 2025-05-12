import { useState } from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginBox, Wrapper } from './style';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

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

    setErrors({});
    console.log(email, password);
  };

  return (
    <Wrapper container>
      <form onSubmit={handleSubmit} noValidate>
        <LoginBox container>
          <Typography variant="h4">Login</Typography>

          <Grid container width="100%" direction="column" alignItems={'flex-start'}>
            <Typography variant="subtitle1">Email</Typography>
            <Input
              name="email"
              placeholder="Write your email..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
              }}
            />
            <Typography variant="inherit" color="error" height={'20px'}>
              {errors.email && errors.email}
            </Typography>
          </Grid>

          <Grid container width="100%" direction="column" alignItems={'flex-start'}>
            <Typography variant="subtitle1">Password</Typography>
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                name="password"
                placeholder="Write your password..."
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
                }}
                padding="0 40px 0 0"
              />
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <Typography variant="inherit" color="error" height={'20px'}>
              {errors.password && errors.password}
            </Typography>
          </Grid>

          <Button type="submit" style={{ marginTop: 24 }}>
            Login
          </Button>
        </LoginBox>
      </form>
    </Wrapper>
  );
};
