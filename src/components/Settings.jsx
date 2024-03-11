import * as React from 'react';
import { useState } from 'react';
import { connect } from "react-redux";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

function Settings(props) {
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const VerifyOtp = (event) => {
    event.preventDefault();
    setOtpVerified(true);
    console.log(otp)
    // const code = otp;
    // window.confirmationResult.confirm(code).then((result) => {
    //   const user = result.user;
    //   console.log(JSON.stringify(user))
    //   alert("User Verified")
    // }).catch((error) => {
    //   console.log("Wrong Otp")
    // });
  }
  
  const SendOtp = (event) => {
    event.preventDefault();
    setOtpSent(true);
    const phoneNumber = "+91" + phone;
    // configureCaptcha();
    // const appVerifier = window.recaptchaVerifier;
    // console.log(phoneNumber)
    // firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    //   .then((confirmationResult) => {
    //     window.confirmationResult = confirmationResult;
    //     console.log('OTP has been sent')
    // }).catch((error) => {
    //   console.log("Not sent")
    // })
  }

  async function EmailSent(event){
    setEmailSent(true);
    // const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
    // await res.user.sendEmailVerification()
    // .then(() => {
    //   setEmailSent(true);
    //   console.log("Email sent")
    // }).catch((error) => {
    //   console.log(error)
    // })
    // const user = firebase.auth().currentUser;
    // if(user !== null){
    //   setFullyVerified(true);
    // }
  }

  console.log(props)

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        /> */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Update Settings
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"EmailSent
                    autoComplete="email"
                    autoFocus
                />
              </Grid>
              {!otpVerified && !emailSent && (
                <Grid item xs={12} sm={6}>
                  <Button
                  type="email-send"
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={EmailSent}
                  >
                    Send Link
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              </Grid>
              {!otpSent && (
                <Grid item xs={12} sm={6}>
                  <Button
                  type="otp-send"
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={SendOtp}
                  >
                    Send Otp
                  </Button>
                </Grid>
              )}
              {otpSent && !otpVerified && (
                <Grid item xs={12} sm={6}>
                  <Button
                  type="otp-verify"
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={VerifyOtp}
                  >
                    Verify Otp
                  </Button>
                </Grid>
              )}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
		ids: state.articleState.ids,
	};
};

export default connect(mapStateToProps)(Settings);
