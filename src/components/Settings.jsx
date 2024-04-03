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
import { setUser } from '../action';
import firebase from "firebase/app";


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
    const [phone, setPhone] = useState('');
    const [currEmail, setCurrEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currPhone, setCurrPhone] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [changedEmail, setChangedEmail] = useState(false);
    const [fullyVerified, setFullyVerified] = useState(false);
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible', 
      'callback': (response) => {
        this.onSignInSubmit();
        console.log("Recaptch verified")
      },
      defaultCountry: "IN"
    })
  }

  async function VerifyOtp(event){
    event.preventDefault();
    let isValid = true;
    let validationMessage = '';
    if (!otp.trim()) {
      isValid = false;
      validationMessage += 'OTP is required. ';
    } else if (!/^\d{6}$/.test(otp)) {
      isValid = false;
      validationMessage += 'Invalid OTP format. ';
    } 
    if (isValid) {
      setOtpVerified(true);
      console.log(otp)
      const code = otp;
      window.confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        console.log(JSON.stringify(user))
        alert("User Verified")
      }).catch((error) => {
        console.log("Wrong Otp")
      });
      const data = {
        phoneNumber: Number(props.user.phoneNumber),
        newPhoneNumber: Number(newPhone),
      }
      console.log(newPhone);
      try {
        const response = await fetch('http://localhost:9000/users/login/changePhoneNumber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }
        console.log(response.status); // Handle successful response
      } catch (error) {
        console.error('Error saving user data:', error); // Handle errors
      }
      props.user.phoneNumber = newPhone;
      console.log("Phone number changed");
      setErrorMessage("Phone number changed");
    } else {
      setErrorMessage(validationMessage);
    }
  }

  async function EmailSent(event){
    // console.log(props.user.email);
    let isValid = true;
    let validationMessage = '';
    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(newEmail)) {
      isValid = false;
      alert('Invalid Email');
      validationMessage += 'Invalid email address. ';
      setErrorMessage(validationMessage);
    } else {
      setErrorMessage('');
    }
    if (!isValid) {
      setErrorMessage(validationMessage);
    } else {
      setEmailSent(true);
      validationMessage = '';
      setFullyVerified(true); // CAUTION!! remove this
      const res = await firebase.auth().createUserWithEmailAndPassword(newEmail, props.user.password)
      await res.user.sendEmailVerification()
      .then(() => {
        setEmailSent(true);
        console.log("Email sent")
      }).catch((error) => {
        console.log(error)
      })
      const user = firebase.auth().currentUser;
      if(user !== null){
        setFullyVerified(true);
      }
    }
  }

  async function ChangeEmail(event){
    console.log(fullyVerified);
    if (fullyVerified) {
      setChangedEmail(true);
      console.log(newEmail);
      const data = {
        email: props.user.email,
        newEmail: newEmail,
      }
      try {
        const response = await fetch('http://localhost:9000/users/login/changeEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }
        console.log(response.status); // Handle successful response
      } catch (error) {
        console.error('Error saving user data:', error); // Handle errors
      }
      alert("Email Changed");
    }
  }
  
  const SendOtp = (event) => {
    event.preventDefault();
    const phoneNumber = "+91" + props.user.phoneNumber;
    let validationMessage = '';
    let isValid = true;
    // Validate phone number
    if (!newPhone.trim()) {
      isValid = false;
      validationMessage += 'Phone number is required. ';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(newPhone)) {
      isValid = false;
      validationMessage += 'Invalid phone number format. ';
    }  
    if (!isValid) {
      setErrorMessage(validationMessage);
    } else {
      setOtpSent(true);
      console.log(props.user.phoneNumber);
      setErrorMessage('');
      configureCaptcha();
      const appVerifier = window.recaptchaVerifier;
      console.log(newPhone);
      if (newPhone === 1) {
        console.warn("Cannot changed to existing number");
      } else {
        console.log(props.user.phoneNumber);
        const newPhone1 = "+91" + newPhone;
        console.log(newPhone1);
        firebase.auth().signInWithPhoneNumber(newPhone1, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            console.log('OTP has been sent');
        }).catch((error) => {
          console.log("Not sent" + error);
        })
      }
    }
  }

  // console.log(props.user);

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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                {/* <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="currEmail"
                    label="Current Email"
                    name="currEmail"
                    autoComplete="email"
                    autoFocus
                    onChange={(event) => setCurrEmail(event.target.value)}
                /> */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="newEmail"
                    label="New Email"
                    name="newEmail"
                    autoComplete="email"
                    autoFocus
                    onChange={(event) => setNewEmail(event.target.value)}
                />
              </Grid>
              {!emailSent && (
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
              {emailSent && !changedEmail && (
                <Grid item xs={12} sm={6}>
                  <Button
                  type="change-email"
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={ChangeEmail}
                  >
                    Change Email
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Current Number"
                  label="Current Number"
                  id="Current Number"
                  autoComplete="phone"
                  onChange={(event) => setCurrPhone(event.target.value)}
                /> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="New Number"
                  label="New Number"
                  id="New Number"
                  autoComplete="phone"
                  onChange={(event) => setNewPhone(event.target.value)}
                />
              </Grid>
              <div id="sign-in-button"></div>
              <div id="recaptcha-container"></div>
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
                  <TextField
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    autoComplete="family-name"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                  />
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
              {/* <Grid item xs={12} sm={6}>
                Change Password
              </Grid> */}
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
	};
};

const mapDispatchToProps = (dispatch) => ({
	setUser: (userData) => dispatch(setUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
