import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import firebase from "firebase/app";
import { Redirect } from "react-router";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { ConfirmationNumber } from '@mui/icons-material';
import { setUser } from '../action';
import { connect } from "react-redux";
import { useDispatch } from 'react-redux'; 
import Cookies from 'js-cookie';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

function SignIn(props) {
  
  const dispatch = useDispatch(); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [finalEmail, setFinalEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [fullyVerified, setFullyVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [signedUp, setSignedUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });  

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

  const VerifyOtp = (event) => {
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
      setErrorMessage('');
      console.log(otp);
      const code = otp;
      // window.confirmationResult.confirm(code).then((result) => {
      //   const user = result.user;
      //   console.log(JSON.stringify(user))
      //   alert("User Verified")
      // }).catch((error) => {
      //   console.log("Wrong Otp")
      // });
    } else {
      setErrorMessage(validationMessage);
    }
  }
  
  const SendOtp = (event) => {
    event.preventDefault();
    let isValid = true;
    let validationMessage = '';
    // Validate phone number
    if (!phone.trim()) {
      isValid = false;
      validationMessage += 'Phone number is required. ';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
      isValid = false;
      validationMessage += 'Invalid phone number format. ';
    }  
    if (isValid) {
      setOtpSent(true);
      setErrorMessage('');
      const phoneNumber = "+91" + phone;
      // configureCaptcha();
      // const appVerifier = window.recaptchaVerifier;
      // console.log(phoneNumber)
      // firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      //   .then((confirmationResult) => {
      //     window.confirmationResult = confirmationResult;
      //     console.log('OTP has been sent')
      // }).catch((error) => {
      //   console.log("Not sent" + error)
      // })
    } else {
      setErrorMessage(validationMessage);
    }
  }

  async function EmailSent(event){
    let isValid = true;
    let validationMessage = '';
    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      isValid = false;
      validationMessage += 'Invalid email address. ';
    }
    if (isValid) {
      setEmailSent(true);
      setFinalEmail(email);
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
      setFullyVerified(true);
    } else {
      setErrorMessage(validationMessage);
    }
  }

  const EmailDelete = (event) => {
    const user = firebase.auth().currentUser;
    console.log(email)
    user.delete().then(() => {
      console.log("Deleted")
    }).catch((error) => {
      console.log(error)
    });
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLoginSuccess = (userData) => {
    // Cookies.set('jwtToken', JSON.stringify(userData), { expires: 1, path: '/', httpOnly: true }); // Set cookie options
    localStorage.setItem("jwtToken", userData);
    console.log('Token has been set');
  };

  async function handleSubmit(event){
    event.preventDefault();

    let isValid = true;
    let validationMessage = '';  

    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      isValid = false;
      validationMessage += 'Invalid email address. ';
    } else {
        isValid = true;
        validationMessage = '';
    }

    // Validate password (basic example, consider stronger requirements)
    if (!password.trim() || password.length < 6) {
      isValid = false;
      validationMessage += 'Password is required and must be at least 6 characters long. ';
    } else {
        isValid = true;
        validationMessage = '';
    }

    if (!isValid) {
      setErrorMessage(validationMessage);
    } else {
        setErrorMessage("Thank you for Signing up")
  
        
        const data1 = {
            email: email,
        };


        try {
            const response = await fetch('https://linkedinapi-1.onrender.com/users/login/handelGetUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data1),
            });
            const textData = await response.text(); // Handle successful response
            const jsonData = JSON.parse(textData);
            console.log(jsonData);
            setPhone(jsonData['phoneNumber']);
            setFirstName(jsonData['username']);
            setErrorMessage(null); // Clear any previous error message
        } catch (error) {
            console.error('Error saving user data:', error); // Handle errors
        }

        const data = {
            username: firstName,
            email: email,
            password: password,
            phoneNumber: phone,
        };
        console.log(data);

        dispatch(setUser(data));
        console.log(props);

        try {
            const response = await fetch('https://linkedinapi-1.onrender.com/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            });
            const textData = await response.text();
            console.log(textData); // Handle successful response
            if (textData.includes('invalid')) {
              setErrorMessage("Invalid Credentials");
            } else {
              handleLoginSuccess(textData);
              setSignedUp(true);
              setErrorMessage(null); // Clear any previous error message
            }

        } catch (error) {
            console.error('Error saving user data:', error); // Handle errors
        }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {signedUp && <Redirect to="/feed" />}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <div id="sign-in-button"></div>
            <Grid container spacing={2}>
              {(
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Grid>
              )}
              {(
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Grid>
              )}
              {otpVerified && !emailSent && (
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
            </Grid>
            <div id="recaptcha-container"></div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user || {},
	};
};

const mapDispatchToProps = (dispatch) => ({
	setUser: (userData) => dispatch(setUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
