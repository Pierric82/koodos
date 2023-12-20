import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from '@mui/icons-material/Close'
import { Theme } from "@mui/material"
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';

import { createUser, triggerEmailLogin, triggerPasswordReset, LoginContext } from '../services/loginContext'


export default function LoginScreen({ handleClose, handleGoogle }:
{ handleClose: () => void,
  handleGoogle: () => void,
}) {
  const [, setLoginState] = React.useContext(LoginContext)
  const [signUpMode, setSignUpMode] = React.useState(false)
  const [confirmSignUp, setConfirmSignUp] = React.useState(false)
  const [fields, setFields] = React.useState({
    name: '',
    password: '',
    passwordConf: '',
    email: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const {name, password, passwordConf, email} = fields
  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({...fields, [e.target.id]: e.target.value})
  }
  const handleToggleMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setSignUpMode(!signUpMode)
    setError(false)
  }
  const handleButtonClick = async () => {
    if (signUpMode && password == passwordConf) {
      setError(false)
      setLoading(true)
      if (await createUser(name, email, password)) {
        setSignUpMode(false)
        setConfirmSignUp(true)
      }
      else
        setError(true)
      setLoading(false)
    }
    else {
      setError(false)
      setLoading(true)
      const loginSuccess = await triggerEmailLogin(setLoginState, email, password)
      setLoading(false)
      if (loginSuccess) handleClose()
      else setError(true)
    }
  }
  const handlePasswordReset = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    triggerPasswordReset(email)
    setConfirmSignUp(true)
  }

  const passwordError = (signUpMode && password.length > 0 && password.length < 8) ? 'Password must be at least 8 characters long' : ''
  const validEmail = /[^@]+@[^.]+\..+/.test(email)
  const emailError = (email.length == 0 || validEmail) ? '' : 'Invalid email address'
  const passwordConfError = (passwordConf.length > 0 && passwordConf != password) ? 'Passwords do not match' : ''
  const nameError = (name.length > 0 && name.length < 4) ? 'Name is too short' : ''
  const clickable = 
    !loading && email.length > 0 && !emailError && password.length > 0 && !passwordError &&
    (!signUpMode || (passwordConf.length > 0 && !passwordConfError && name.length > 3 ))
  const buttonText = loading ? "Loading..." : ("Sign " + (signUpMode ? "Up" : "In"))

  let errorMessage = <></>
  if (error && signUpMode) errorMessage = <p className="errorMessage">Error signing up. Maybe the email address is already in use.</p>
  else if (error) errorMessage = <p className="errorMessage">Incorrect login. Either the credentials are incorrect, or the email is still unverified.</p>
  let message = signUpMode ? <>Already a user? <a href="#" onClick={(e) => handleToggleMode(e)}> Sign in </a> instead!</>
          : <>
            No account yet? Then let's get you <a href="#" onClick={(e) => handleToggleMode(e)}>signed up</a> now!
            <br/>Password forgotten? Fill in your email {validEmail ? <>and <a href="#" onClick={(e) => handlePasswordReset(e)}>click here</a></> : 'first'}.
            </>

  const dialogContent = 
    confirmSignUp ? <div className="dialogConfirm">Thank you, please check your email</div> :
    <DialogContent>
      <Divider sx={{ marginTop: "10px" }}>Sign {signUpMode ? 'up' : 'in'} using e-mail</Divider>
      <Box sx={{ textAlign: "center", padding: "10px" }}>
        <form>
          { signUpMode && <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              placeholder="Your name as you want to see it displayed"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleChangeField}
              value={name}
              error={nameError.length > 0}
              helperText={nameError} 
          />}
          <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              placeholder="Your email address"
              type="email"
              fullWidth
              variant="outlined"
              onChange={handleChangeField}
              value={email}
              error={emailError.length > 0}
              helperText={emailError} 
          />
          <TextField
              margin="dense"
              id="password"
              label="Password"
              placeholder={ signUpMode ? "Choose a password" : "Enter your password" }
              type="password"
              fullWidth
              variant="outlined"
              onChange={handleChangeField}
              value={password}
              error={passwordError.length > 0}
              helperText={passwordError} 
          />
          { signUpMode && <TextField
              margin="dense"
              id="passwordConf"
              label="Password confirmation"
              placeholder="Repeat your password"
              type="password"
              fullWidth
              variant="outlined"
              onChange={handleChangeField}
              value={passwordConf}
              error={passwordConfError.length > 0}
              helperText={passwordConfError} 
          />}
          <Button className="signInUpButton" variant="contained" disabled={!clickable} onClick={handleButtonClick}>
              {buttonText}
          </Button>
          <br/>
          {errorMessage}
          {message}
        </form>
      </Box>
      <Divider sx={{ marginTop: "10px" }}>Sign in using Google</Divider>
      <Box sx={{ textAlign: "center", padding: "10px" }}>
        <GoogleButton onClick={ handleGoogle }/>
      </Box>
    </DialogContent>

  return <Dialog open fullWidth onBackdropClick={ handleClose }>
    <DialogTitle>Sign in or sign up to Koodos
      <IconButton
          aria-label="close"
          onClick={ handleClose }
          sx={{
              position: 'absolute',
              right: '8px',
              top: '12px',
              color: (theme: Theme) => theme.palette.grey[500],
          }}
          >
          <CloseIcon/>
      </IconButton>
    </DialogTitle>
    {dialogContent}
  </Dialog>
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return <button className="gsi-material-button" onClick={onClick}>
  <div className="gsi-material-button-state"></div>
  <div className="gsi-material-button-content-wrapper">
    <div className="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span className="gsi-material-button-contents">Sign in with Google</span>
    <span style={{display: "none"}}>Sign in with Google</span>
  </div>
</button>
}
