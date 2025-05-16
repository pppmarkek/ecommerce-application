import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import axios from 'axios';
import {
  Grid,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Wrapper,
  RegistrationBox,
  LineInputBox,
  SmallInputBox,
  RegistrationBoxField,
  RegistrationButton,
} from './style';
import {
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
  validateStreet,
  validateCity,
  validatePostCode,
  validateCountry,
  validateDateOfBirth,
  validateStreetShipping,
  validateCityShipping,
  validatePostCodeShipping,
  validateCountryShipping,
} from '../../utils/validation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { signUpCustomer, ErrorResponse, loginCustomer } from '@/services/api';
import type { CustomerDraft } from '@commercetools/platform-sdk';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchMe } from '@/store/userSlice';

export const SignupPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState<string>('');
  const [countryShipping, setCountryShipping] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setDate] = useState<Dayjs | null>(null);
  const navigate = useNavigate();
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDefaultBilling = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultBilling(e.target.checked);
  };

  function syncField(form: HTMLFormElement, fromName: string, toName: string, enabled: boolean) {
    if (!enabled) return;
    const fromEl = form.elements.namedItem(fromName) as HTMLInputElement | null;
    const toEl = form.elements.namedItem(toName) as HTMLInputElement | null;
    if (fromEl && toEl) {
      toEl.value = fromEl.value;
    }
  }

  const handleSameAsBilling = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);

    const form = e.currentTarget.form!;
    syncField(form, 'street', 'streetShipping', checked);
    syncField(form, 'city', 'cityShipping', checked);
    syncField(form, 'postCode', 'postCodeShipping', checked);
    syncField(form, 'country', 'countryShipping', checked);
  };

  const handleDefaultShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultShipping(e.target.checked);
  };

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    setCountry(val);
    setErrors((prev) => ({
      ...prev,
      country: validateCountry(val),
    }));

    const field = e.target as HTMLInputElement;
    const form = field.form;
    if (!form) return;
    syncField(form, 'country', 'countryShipping', sameAsBilling);
  };

  useEffect(() => {
    if (sameAsBilling) {
      setCountryShipping(country);
    }
  }, [country, sameAsBilling]);

  const handleCountryShippingChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value;
    if (sameAsBilling) setSameAsBilling(false);
    setCountryShipping(val);
    setErrors((prev) => ({
      ...prev,
      countryShipping: validateCountryShipping(val),
    }));
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
    setErrors((prev) => ({
      ...prev,
      dob: validateDateOfBirth(newDate),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
      | 'email'
      | 'password'
      | 'firstName'
      | 'lastName'
      | 'street'
      | 'postCode'
      | 'city'
      | 'country'
      | 'dob'
      | 'streetShipping'
      | 'postCodeShipping'
      | 'cityShipping'
      | 'countryShipping',
      string
    >;

    const {
      email,
      password,
      firstName,
      lastName,
      street,
      postCode,
      city,
      country,
      dob,
      streetShipping,
      postCodeShipping,
      cityShipping,
      countryShipping,
    } = formValues;

    const newErrors: Record<string, string> = {
      email: validateEmail(email),
      password: validatePassword(password),
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      street: validateStreet(street),
      postCode: validatePostCode(postCode),
      city: validateCity(city),
      country: validateCountry(country),
      dob: validateDateOfBirth(dob ? dayjs(dob) : null),

      streetShipping: validateStreetShipping(streetShipping),
      postCodeShipping: validatePostCodeShipping(postCodeShipping),
      cityShipping: validateCityShipping(cityShipping),
      countryShipping: validateCountryShipping(countryShipping),
    };
    Object.keys(newErrors).forEach((k) => {
      if (!newErrors[k]) delete newErrors[k];
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formattedDob = dob ? dayjs(dob, 'MM/DD/YYYY').format('YYYY-MM-DD') : undefined;
    const billingCountry = country.toUpperCase();
    const shippingCountry = countryShipping.toUpperCase();

    const addresses = [
      {
        streetName: street,
        postalCode: postCode,
        city: city,
        country: billingCountry,
      },
      {
        streetName: streetShipping,
        postalCode: postCodeShipping,
        city: cityShipping,
        country: shippingCountry,
      },
    ];

    const draft: CustomerDraft = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth: formattedDob,
      addresses,
      defaultBillingAddress: defaultBilling ? 0 : undefined,
      defaultShippingAddress: defaultShipping ? 1 : undefined,
      billingAddresses: defaultBilling ? [0] : [],
      shippingAddresses: defaultShipping ? [1] : [],
    };

    try {
      await signUpCustomer(draft).then(async (res) => {
        if (res.customer) {
          const { access_token, refresh_token } = await loginCustomer(email, password);
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          await dispatch(fetchMe()).unwrap();
        }
      });
      navigate('/');
    } catch (err: unknown) {
      let message = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ErrorResponse;
        message = data.error_description ?? data.message ?? message;
      }
      setErrors({ signUp: message });
    }
  };

  return (
    <Wrapper container>
      <form onSubmit={handleSubmit} noValidate>
        <RegistrationBox container>
          <RegistrationBoxField container>
            <Grid width={'350px'}>
              <Typography variant="h4">SingUp</Typography>
              <Typography variant="inherit" color="error" minHeight="20px" width={'100%'}>
                {errors.singUp}
              </Typography>
              <Grid container direction="column" alignItems="flex-start" width={'100%'}>
                <Typography variant="subtitle1">Email</Typography>
                <Input
                  name="email"
                  placeholder="Enter Email..."
                  onChange={(e) => {
                    const val = e.target.value;
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
                    placeholder="Enter Password..."
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
                    }}
                    padding="0 40px 0 0"
                  />
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
                <Typography variant="inherit" color="error" height="20px">
                  {errors.password}
                </Typography>
              </Grid>

              <LineInputBox container>
                <SmallInputBox container>
                  <Typography variant="subtitle1">First Name</Typography>
                  <Input
                    name="firstName"
                    placeholder="Enter FirstName..."
                    onChange={(e) => {
                      const val = e.target.value;
                      setErrors((prev) => ({ ...prev, firstName: validateFirstName(val) }));
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.firstName}
                  </Typography>
                </SmallInputBox>

                <SmallInputBox container>
                  <Typography variant="subtitle1">Last Name</Typography>
                  <Input
                    name="lastName"
                    placeholder="Enter LastName..."
                    onChange={(e) => {
                      const val = e.target.value;
                      setErrors((prev) => ({ ...prev, lastName: validateLastName(val) }));
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.lastName}
                  </Typography>
                </SmallInputBox>
              </LineInputBox>

              <Grid width={'100%'} height={'70px'}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="dob"
                    onChange={handleDateChange}
                    label="Date of Birth"
                    slotProps={{
                      layout: {
                        sx: {
                          backgroundColor: '#fff',
                          color: '#000',

                          '&& .MuiYearCalendar-root button': {
                            color: '#000 !important',
                          },

                          '&& .MuiYearCalendar-root button.Mui-selected': {
                            backgroundColor: '#000 !important',
                            color: '#fff !important',
                          },

                          '&& .MuiYearCalendar-root button.Mui-selected:hover': {
                            backgroundColor: '#f0f0f0 !important',
                            color: '#000 !important',
                          },

                          '& .MuiPickersCalendarHeader-label': { color: '#000 !important' },

                          '& .MuiPickersCalendarHeader-switchViewButton': {
                            background: '#3f3f3f',
                            '&:hover': {
                              background: '#000 !important',
                            },
                          },

                          '&& .MuiPickersArrowSwitcher-root .MuiIconButton-root': {
                            background: '#3f3f3f !important',
                            '&:hover': {
                              background: '#000 !important',
                            },
                          },
                        },
                      },

                      day: {
                        sx: {
                          color: '#000',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                          '&&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                          },
                          '&&.Mui-selected:hover': {
                            backgroundColor: '#e0e0e0',
                            color: '#000',
                          },
                        },
                      },

                      textField: {
                        name: 'dob',
                        variant: 'standard',
                        fullWidth: true,
                        sx: { width: '100%' },
                        InputLabelProps: {
                          sx: { color: '#fff', '&.Mui-focused': { color: '#fff' } },
                        },
                        InputProps: {
                          sx: {
                            color: '#fff',
                            '&:before': { borderBottom: '1px solid #aaa' },
                            '&:hover:not(.Mui-disabled, .Mui-error):before': {
                              borderBottom: '1px solid #fff',
                            },
                            '&:after': { borderBottom: '1px solid #fff' },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                <Typography
                  variant="inherit"
                  color="error"
                  height="20px"
                  display={'flex'}
                  alignItems={'flex-start'}
                >
                  {errors.dob}
                </Typography>
              </Grid>
            </Grid>
            <Grid width={'350px'}>
              <Grid marginBottom={'20px'}>
                <Typography variant="h4">Billing Address</Typography>
              </Grid>

              <Grid
                container
                direction="column"
                alignContent="flex-start"
                justifyContent={'flex-end'}
                width={'100%'}
                height={'88px'}
              >
                <FormControl
                  variant="standard"
                  sx={{ m: 1, width: '100%', margin: 0 }}
                  error={!!errors.country}
                >
                  <InputLabel
                    sx={{
                      color: '#fff',
                      fontWeight: 400,
                      '&.Mui-focused': {
                        color: '#fff',
                      },
                      '&.Mui-error': {
                        color: '#fff',
                      },
                    }}
                  >
                    Country
                  </InputLabel>
                  <Select
                    name="country"
                    value={country}
                    onChange={handleCountryChange}
                    label="Country"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#fff',
                          '& .MuiMenuItem-root': {
                            color: '#000',
                          },
                        },
                      },
                    }}
                    input={
                      <Input
                        sx={{
                          '& .MuiSelect-select': {
                            alignItems: 'flex-start',
                            paddingTop: '6px',
                            paddingBottom: '4px',
                            display: 'flex',
                          },
                          color: '#fff',
                          '&:before': {
                            borderBottom: '1px solid #aaa',
                          },
                          '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '1px solid #fff',
                          },
                          '&:after': {
                            borderBottom: '1px solid #fff',
                          },
                        }}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em style={{ color: '#000' }}>None</em>
                    </MenuItem>
                    <MenuItem value="ae">United Arab Emirates</MenuItem>
                    <MenuItem value="ar">Argentina</MenuItem>
                    <MenuItem value="at">Austria</MenuItem>
                    <MenuItem value="au">Australia</MenuItem>
                    <MenuItem value="be">Belgium</MenuItem>
                    <MenuItem value="br">Brazil</MenuItem>
                    <MenuItem value="ca">Canada</MenuItem>
                    <MenuItem value="ch">Switzerland</MenuItem>
                    <MenuItem value="cl">Chile</MenuItem>
                    <MenuItem value="cn">China</MenuItem>
                    <MenuItem value="co">Colombia</MenuItem>
                    <MenuItem value="cz">Czech Republic</MenuItem>
                    <MenuItem value="de">Germany</MenuItem>
                    <MenuItem value="dk">Denmark</MenuItem>
                    <MenuItem value="eg">Egypt</MenuItem>
                    <MenuItem value="es">Spain</MenuItem>
                    <MenuItem value="fi">Finland</MenuItem>
                    <MenuItem value="fr">France</MenuItem>
                    <MenuItem value="gb">United Kingdom</MenuItem>
                    <MenuItem value="gr">Greece</MenuItem>
                    <MenuItem value="ie">Ireland</MenuItem>
                    <MenuItem value="il">Israel</MenuItem>
                    <MenuItem value="in">India</MenuItem>
                    <MenuItem value="id">Indonesia</MenuItem>
                    <MenuItem value="it">Italy</MenuItem>
                    <MenuItem value="jp">Japan</MenuItem>
                    <MenuItem value="ke">Kenya</MenuItem>
                    <MenuItem value="kr">South Korea</MenuItem>
                    <MenuItem value="lv">Latvia</MenuItem>
                    <MenuItem value="ma">Morocco</MenuItem>
                    <MenuItem value="mx">Mexico</MenuItem>
                    <MenuItem value="my">Malaysia</MenuItem>
                    <MenuItem value="ng">Nigeria</MenuItem>
                    <MenuItem value="nl">Netherlands</MenuItem>
                    <MenuItem value="no">Norway</MenuItem>
                    <MenuItem value="nz">New Zealand</MenuItem>
                    <MenuItem value="pe">Peru</MenuItem>
                    <MenuItem value="ph">Philippines</MenuItem>
                    <MenuItem value="pl">Poland</MenuItem>
                    <MenuItem value="pt">Portugal</MenuItem>
                    <MenuItem value="ru">Russia</MenuItem>
                    <MenuItem value="sa">Saudi Arabia</MenuItem>
                    <MenuItem value="se">Sweden</MenuItem>
                    <MenuItem value="sg">Singapore</MenuItem>
                    <MenuItem value="th">Thailand</MenuItem>
                    <MenuItem value="tr">Turkey</MenuItem>
                    <MenuItem value="ua">Ukraine</MenuItem>
                    <MenuItem value="us">United States</MenuItem>
                    <MenuItem value="vn">Vietnam</MenuItem>
                    <MenuItem value="za">South Africa</MenuItem>
                  </Select>
                </FormControl>

                <Typography
                  variant="inherit"
                  color="error"
                  height="20px"
                  display={'flex'}
                  alignItems={'flex-start'}
                >
                  {errors.country}
                </Typography>
              </Grid>

              <Grid container direction="column" alignItems="flex-start" width={'100%'}>
                <Typography variant="subtitle1">City</Typography>
                <Input
                  name="city"
                  placeholder="Enter city..."
                  onChange={(e) => {
                    setErrors((prev) => ({ ...prev, city: validateCity(e.target.value) }));
                    syncField(e.currentTarget.form!, 'city', 'cityShipping', sameAsBilling);
                  }}
                />
                <Typography variant="inherit" color="error" height="20px">
                  {errors.city}
                </Typography>
              </Grid>

              <LineInputBox container>
                <SmallInputBox container>
                  <Typography variant="subtitle1">Street</Typography>
                  <Input
                    name="street"
                    placeholder="Enter street..."
                    onChange={(e) => {
                      setErrors((prev) => ({ ...prev, street: validateStreet(e.target.value) }));
                      syncField(e.currentTarget.form!, 'street', 'streetShipping', sameAsBilling);
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.street}
                  </Typography>
                </SmallInputBox>
                <SmallInputBox container>
                  <Typography variant="subtitle1">Postal Code</Typography>
                  <Input
                    name="postCode"
                    placeholder="Enter PostalCode..."
                    onChange={(e) => {
                      setErrors((prev) => ({
                        ...prev,
                        postCode: validatePostCode(e.target.value),
                      }));
                      syncField(
                        e.currentTarget.form!,
                        'postCode',
                        'postCodeShipping',
                        sameAsBilling,
                      );
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.postCode}
                  </Typography>
                </SmallInputBox>
              </LineInputBox>

              <Grid container justifyContent={'space-between'} height={'70px'} width={'100%'}>
                <Grid width={'45%'} container alignItems={'center'}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="defaultShipping"
                        checked={defaultBilling}
                        onChange={handleDefaultBilling}
                        color="primary"
                      />
                    }
                    label="Set as default"
                  />
                </Grid>

                <Grid width={'45%'} container alignItems={'center'}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="defaultShipping"
                        checked={sameAsBilling}
                        onChange={handleSameAsBilling}
                        color="primary"
                      />
                    }
                    label="Same shipping"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid width={'350px'}>
              <Grid marginBottom={'20px'}>
                <Typography variant="h4">Shipping Address</Typography>
              </Grid>

              <Grid
                container
                direction="column"
                alignContent="flex-start"
                justifyContent={'flex-end'}
                width={'100%'}
                height={'88px'}
              >
                <FormControl
                  variant="standard"
                  sx={{ m: 1, width: '100%', margin: 0 }}
                  error={!!errors.countryShipping}
                >
                  <InputLabel
                    sx={{
                      color: '#fff',
                      fontWeight: 400,
                      '&.Mui-focused': {
                        color: '#fff',
                      },
                      '&.Mui-error': {
                        color: '#fff',
                      },
                    }}
                  >
                    Country
                  </InputLabel>
                  <Select
                    name="countryShipping"
                    value={countryShipping}
                    onChange={handleCountryShippingChange}
                    label="Country"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#fff',
                          '& .MuiMenuItem-root': {
                            color: '#000',
                          },
                        },
                      },
                    }}
                    input={
                      <Input
                        sx={{
                          '& .MuiSelect-select': {
                            alignItems: 'flex-start',
                            paddingTop: '6px',
                            paddingBottom: '4px',
                            display: 'flex',
                          },
                          color: '#fff',
                          '&:before': {
                            borderBottom: '1px solid #aaa',
                          },
                          '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '1px solid #fff',
                          },
                          '&:after': {
                            borderBottom: '1px solid #fff',
                          },
                        }}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em style={{ color: '#000' }}>None</em>
                    </MenuItem>
                    <MenuItem value="ae">United Arab Emirates</MenuItem>
                    <MenuItem value="ar">Argentina</MenuItem>
                    <MenuItem value="at">Austria</MenuItem>
                    <MenuItem value="au">Australia</MenuItem>
                    <MenuItem value="be">Belgium</MenuItem>
                    <MenuItem value="br">Brazil</MenuItem>
                    <MenuItem value="ca">Canada</MenuItem>
                    <MenuItem value="ch">Switzerland</MenuItem>
                    <MenuItem value="cl">Chile</MenuItem>
                    <MenuItem value="cn">China</MenuItem>
                    <MenuItem value="co">Colombia</MenuItem>
                    <MenuItem value="cz">Czech Republic</MenuItem>
                    <MenuItem value="de">Germany</MenuItem>
                    <MenuItem value="dk">Denmark</MenuItem>
                    <MenuItem value="eg">Egypt</MenuItem>
                    <MenuItem value="es">Spain</MenuItem>
                    <MenuItem value="fi">Finland</MenuItem>
                    <MenuItem value="fr">France</MenuItem>
                    <MenuItem value="gb">United Kingdom</MenuItem>
                    <MenuItem value="gr">Greece</MenuItem>
                    <MenuItem value="ie">Ireland</MenuItem>
                    <MenuItem value="il">Israel</MenuItem>
                    <MenuItem value="in">India</MenuItem>
                    <MenuItem value="id">Indonesia</MenuItem>
                    <MenuItem value="it">Italy</MenuItem>
                    <MenuItem value="jp">Japan</MenuItem>
                    <MenuItem value="ke">Kenya</MenuItem>
                    <MenuItem value="kr">South Korea</MenuItem>
                    <MenuItem value="lv">Latvia</MenuItem>
                    <MenuItem value="ma">Morocco</MenuItem>
                    <MenuItem value="mx">Mexico</MenuItem>
                    <MenuItem value="my">Malaysia</MenuItem>
                    <MenuItem value="ng">Nigeria</MenuItem>
                    <MenuItem value="nl">Netherlands</MenuItem>
                    <MenuItem value="no">Norway</MenuItem>
                    <MenuItem value="nz">New Zealand</MenuItem>
                    <MenuItem value="pe">Peru</MenuItem>
                    <MenuItem value="ph">Philippines</MenuItem>
                    <MenuItem value="pl">Poland</MenuItem>
                    <MenuItem value="pt">Portugal</MenuItem>
                    <MenuItem value="ru">Russia</MenuItem>
                    <MenuItem value="sa">Saudi Arabia</MenuItem>
                    <MenuItem value="se">Sweden</MenuItem>
                    <MenuItem value="sg">Singapore</MenuItem>
                    <MenuItem value="th">Thailand</MenuItem>
                    <MenuItem value="tr">Turkey</MenuItem>
                    <MenuItem value="ua">Ukraine</MenuItem>
                    <MenuItem value="us">United States</MenuItem>
                    <MenuItem value="vn">Vietnam</MenuItem>
                    <MenuItem value="za">South Africa</MenuItem>
                  </Select>
                </FormControl>

                <Typography
                  variant="inherit"
                  color="error"
                  height="20px"
                  display={'flex'}
                  alignItems={'flex-start'}
                >
                  {errors.countryShipping}
                </Typography>
              </Grid>

              <Grid container direction="column" alignItems="flex-start" width={'100%'}>
                <Typography variant="subtitle1">City</Typography>
                <Input
                  name="cityShipping"
                  placeholder="Enter city..."
                  onChange={(e) => {
                    const val = e.target.value;
                    if (sameAsBilling) setSameAsBilling(false);
                    setErrors((prev) => ({ ...prev, cityShipping: validateCityShipping(val) }));
                  }}
                />
                <Typography variant="inherit" color="error" height="20px">
                  {errors.cityShipping}
                </Typography>
              </Grid>

              <LineInputBox container>
                <SmallInputBox container>
                  <Typography variant="subtitle1">Street</Typography>
                  <Input
                    name="streetShipping"
                    placeholder="Enter street..."
                    onChange={(e) => {
                      const val = e.target.value;
                      if (sameAsBilling) setSameAsBilling(false);
                      setErrors((prev) => ({
                        ...prev,
                        streetShipping: validateStreetShipping(val),
                      }));
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.streetShipping}
                  </Typography>
                </SmallInputBox>

                <SmallInputBox container>
                  <Typography variant="subtitle1">Postal Code</Typography>
                  <Input
                    name="postCodeShipping"
                    placeholder="Enter PostalCode..."
                    onChange={(e) => {
                      const val = e.target.value;
                      if (sameAsBilling) setSameAsBilling(false);
                      setErrors((prev) => ({
                        ...prev,
                        postCodeShipping: validatePostCodeShipping(val),
                      }));
                    }}
                  />
                  <Typography variant="inherit" color="error" height="20px">
                    {errors.postCodeShipping}
                  </Typography>
                </SmallInputBox>
              </LineInputBox>

              <Grid container justifyContent={'space-between'} height={'70px'} width={'100%'}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="defaultShipping"
                      checked={defaultShipping}
                      onChange={handleDefaultShipping}
                      color="primary"
                    />
                  }
                  label="Set as default"
                />
              </Grid>
            </Grid>
          </RegistrationBoxField>

          <RegistrationButton container>
            <Button width="100%" type="submit">
              SingUp
            </Button>
            <Link to={'/login'}>Login</Link>
          </RegistrationButton>
        </RegistrationBox>
      </form>
    </Wrapper>
  );
};
