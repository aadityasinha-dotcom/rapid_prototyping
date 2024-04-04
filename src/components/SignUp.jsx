import * as React from 'react';
import { useState, useEffect } from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
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
import intlTelInput from 'intl-tel-input';
import ReactGeocode from 'react-geocode';
import { setUser } from '../action';
import { connect } from "react-redux";
import { useDispatch } from 'react-redux'; 
import styled from "styled-components";

// TODO remove, this demo shouldn't need to reset the theme.

const Country = styled.section`
	display: flex;
	flex-wrap: wrap;
	align-content: start;
	min-height: 1px;
	padding-bottom: 1px;
	padding-top: 4px;
	padding: 12px 0;
	position: relative;
	width: 100%;
	max-width: 8px;
	align-items: center;
	margin: auto;

	@media (max-width: 768px) {
		min-height: 0;
	}
`;

const defaultTheme = createTheme();

function SignUp(props) {
  
  const dispatch = useDispatch(); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [finalEmail, setFinalEmail] = useState('');
  const [country, setCountry] = useState('+91');
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
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [ip, setIP] = useState("");

  useEffect(() => {

    const apiKey = '9916d506456c9367ead7c864d0c9446faf041cc733d6e79566b9966a';

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.ipdata.co?api-key=${apiKey}&fields=calling_code`);
        const textData = await res.text();
        const jsonData = JSON.parse(textData);
        setCountryCode("+"+jsonData['calling_code']);
        console.log(jsonData['calling_code']);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

    fetchData();
  }, []);


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
      window.confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        console.log(JSON.stringify(user))
        alert("User Verified")
      }).catch((error) => {
        alert("Wrong OTP")
        console.log("Wrong Otp" + error)
      });
    } else {
      setErrorMessage(validationMessage);
    }
  }
  
  const SendOtp = (event) => {
    event.preventDefault();
    let isValid = true;
    let validationMessage = '';
    console.log("+" + country + phone);
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
      configureCaptcha();
      const appVerifier = window.recaptchaVerifier;
      console.log(phoneNumber)
      firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          console.log('OTP has been sent')
      }).catch((error) => {
        console.log("Not sent" + error)
      })
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
      alert('Invalid Email');
      validationMessage += 'Invalid email address. ';
      setErrorMessage(validationMessage);
    }
    if (isValid) {
      setEmailSent(true);
      setFinalEmail(email);
      const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
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
  

  async function handleSubmit(event){
    event.preventDefault();

    let isValid = true;
    let validationMessage = '';

    // Validate first name
    if (!firstName.trim()) {
      isValid = false;
      validationMessage += 'First name is required. ';
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
      isValid = false;
      validationMessage += 'First name must only contain alphabets. ';
    }

    // Validate last name
    if (!lastName.trim()) {
      isValid = false;
      validationMessage += 'Last name is required. ';
    } else if (!/^[A-Za-z]+$/.test(lastName)) {
      isValid = false;
      validationMessage += 'Last name must only contain alphabets. ';
    }
    
    // Validate phone number
    if (!phone.trim()) {
      isValid = false;
      validationMessage += 'Phone number is required. ';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
      isValid = false;
      validationMessage += 'Invalid phone number format. ';
    }    

    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      isValid = false;
      validationMessage += 'Invalid email address. ';
    }

    // Validate password (basic example, consider stronger requirements)
    if (!password.trim() || password.length < 6) {
      isValid = false;
      validationMessage += 'Password is required and must be at least 6 characters long. ';
    }

    if(!fullyVerified){
      isValid = false;
    }

    if (!isValid) {
      setErrorMessage(validationMessage);
    } else {
      // Assuming successful validation, perform any necessary actions (e.g., form submission)
      console.log('Form data:', {
        firstName,
        lastName,
        email,
        password,
      });
      setErrorMessage(null); // Clear any previous error message
    }
    if (!fullyVerified){
      setErrorMessage("Not verified");
    } else {
      setErrorMessage("Thank you for Signing up")

      const data = {
        username: firstName,
        email: email,
        password: password,
        phoneNumber: phone,
      };

      // props.user.email = finalEmail;
      // props.user.password = password;
      // props.user.phoneNumber = phone;
      // console.log(props);
      dispatch(setUser(data));
      console.log(props);

      try {
        const response = await fetch('https://linkedinapi-1.onrender.com/users', {
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
      setSignedUp(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div id="google_translate_element">
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <div id="sign-in-button"></div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </Grid>
                <Country>
                  {countryCode}
                </Country>
                <Grid item xs={12} sm={5}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    autoComplete="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
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
                {otpVerified && (
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
                {otpVerified && (
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
                {otpVerified && !emailSent && (
                  <Grid item xs={12} sm={6}>
                    <Button
                    type="email-del"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={EmailDelete}
                    >
                      Delete Email
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <div id="recaptcha-container"></div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
