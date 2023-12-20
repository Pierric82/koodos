import * as React from "react"
import * as ReactDOM from "react-dom"

import BoardComponent from "./components/board"
import BoardListComponent from "./components/boardList"
import Loading from "./components/loading"
import LoginScreen from "./components/loginScreen"
import AccountScreen from "./components/accountScreen"

import { LoginContext, triggerGoogleSignIn, triggerSignOut, useLoginState } from "./services/loginContext"
import { useNavigationState} from "./services/navigation"

function App() {

  const {loginState, setLoginState} = useLoginState()

  const [activeBoardId, setActiveBoardId] = useNavigationState()
  const unselectBoard = () => setActiveBoardId('')

  const [overlayLoginScreen, setOverlayScreen] = React.useState('')

  if (loginState.loading || loginState.loggingIn) return <Loading/>

  let mainSection = <></>
  if (activeBoardId)
    mainSection = <BoardComponent boardId={activeBoardId} />
  else if (loginState.user)
    mainSection = <BoardListComponent selectBoard={setActiveBoardId} />
  else
    mainSection = <div id="boardList" className="boardListPanel">
      <div id="pleaseSignIn">
        <p>Please click Sign In at the top of this screen to get started!</p>
        <p>Please note this is an <b>alpha</b> version of Koodos.
           Verification emails cannot yet be resent.</p>
     </div>
    </div>

  return (
    <LoginContext.Provider value={[loginState, setLoginState]}><div>
    <nav className="navbar">
      <ul>
        <li><a href="#" onClick={unselectBoard}>Home</a></li>
        <li className="nav-title">KOODOS</li>
        <li className="nav-login">
         {loginState.user ? 
              <>
                <a onClick={(e) => {e.preventDefault(); setOverlayScreen('account')}} href="#">Account</a> 
                &nbsp;| <a onClick={(e) => triggerSignOut(setLoginState,e)} href="#">Sign Out</a>
              </>
            : <a onClick={(e) => {e.preventDefault(); setOverlayScreen('signin')}} href="#">Sign in</a>}
        </li>
      </ul>
    </nav>
    {mainSection}
    { overlayLoginScreen == 'signin' && 
        <LoginScreen
          handleClose={() => setOverlayScreen('')}
          handleGoogle={() => {triggerGoogleSignIn(setLoginState,null); setOverlayScreen('') }}
        /> 
    }
    { overlayLoginScreen == 'account' && 
        <AccountScreen
          handleClose={() => setOverlayScreen('')}
        /> 
    }
    </div></LoginContext.Provider>
  )
}

ReactDOM.render(
  <React.StrictMode><App/></React.StrictMode>,
  document.getElementById("root")
)
