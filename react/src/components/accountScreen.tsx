
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

import {requestEmailChange, changeUserName, triggerPasswordReset, triggerSignOut, LoginContext } from '../services/loginContext'


export default function AccountScreen({ handleClose }:
{ handleClose: () => void,
}) {
  const [loginState, setLoginState] = React.useContext(LoginContext)

  const [fields, setFields] = React.useState({
    email: loginState.user?.email,
    name: loginState.user?.nickname
  })
  const [confirmation, setConfirmation] = React.useState('')

  const {email, name} = fields
  const validEmail = /[^@]+@[^.]+\..+/.test(email)
  const emailError = (email.length == 0 || validEmail) ? '' : 'Invalid email address'
  const nameError = (name.length == 0 || name.length > 3) ? '' : 'Name too short'
  const emailChangeReady = emailError.length == 0 && email != loginState.user?.email
  const nameChangeReady = nameError.length == 0 && name != loginState.user?.nickname


  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({...fields, [e.target.id]: e.target.value})
  }

  const handleChangeEmail = () => {
    requestEmailChange(email)
    setConfirmation('Email updated. Check your inbox now.')
    triggerSignOut(setLoginState)
  }
  const handleChangeName = () => {
    changeUserName(loginState.user.id, name)
    setLoginState({loading: false, loggingIn: false, user: {...loginState.user, nickname: name}})
    setConfirmation('Name updated.')
  }
  const handlePasswordReset = () => {
    triggerPasswordReset(loginState.user.email)
    setConfirmation('Please check your email now.')
    triggerSignOut(setLoginState)
  }

  const dialogContent = 
    confirmation ? <div className="dialogConfirm">{confirmation}</div> :
    <Box sx={{ padding: '20px'}}>
      <Divider sx={{ marginTop: "10px" }}>Update your email address</Divider>
      <TextField
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
      <Button disabled={!emailChangeReady} onClick={handleChangeEmail}>Update email address</Button>
      <span className="dialogHint">(you will be logged out)</span>
      <Divider sx={{ marginTop: "10px" }}>Update your displayed name</Divider>
      <TextField
          margin="dense"
          id="name"
          label="Displayed Name"
          placeholder="Your name as you want to see is displayed"
          type="text"
          fullWidth
          variant="outlined"
          onChange={handleChangeField}
          value={name}
          error={nameError.length > 0}
          helperText={nameError} 
      />
      <Button disabled={!nameChangeReady} onClick={handleChangeName}>Update your name</Button>
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }}>Reset your password</Divider>
      Click <a href="#" onClick={(e) => {e.preventDefault(); handlePasswordReset();}}>here</a> to reset your password <span className="dialogHint">(you will be logged out)</span>
    </Box>


  return <Dialog maxWidth="xs" open fullWidth onBackdropClick={ handleClose }>
    <DialogTitle>Account settings
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
