import { Grid, Typography } from '@mui/material';
import { LoginBox, Wrapper } from './style';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';

export const LoginPage = () => {
  return (
    <Wrapper container>
      <LoginBox container>
        <Typography variant="h4">Login</Typography>
        <Grid container width={'100%'} gap={'20px'}>
          <Grid container width={'100%'}>
            <Typography variant="subtitle1">Email</Typography>
            <Input placeholder="Write your email..." />
          </Grid>
          <Grid container width={'100%'}>
            <Typography variant="subtitle1">Password</Typography>
            <Input placeholder="Write your password..." type="password" />
          </Grid>
        </Grid>
        <Button>Login</Button>
      </LoginBox>
    </Wrapper>
  );
};
