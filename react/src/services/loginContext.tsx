import * as React from "react"
import { pb, getFullUser } from "./backend"
import {IUser} from "../interfaces/interfaces"


export interface LoginState {
    loading: boolean,
    loggingIn: boolean,
    user?: IUser
}

export const LoginContext = React.createContext<[LoginState, React.Dispatch<React.SetStateAction<LoginState>>]>(null)

async function initialLogin(loginState: LoginState, setLoginState: React.Dispatch<React.SetStateAction<LoginState>>) {
    if (loginState.user)
        return
    if (pb.authStore.isValid) {
        setLoginState({
            loading: false,
            loggingIn: true,
            user: null
        })
        getFullUser(pb.authStore.model.id).then (u => setLoginState({
        loading: false,
        loggingIn: false,
        user: u
        }))
    }
    else
        setLoginState({
            loading: false,
            loggingIn: false,
            user: null
        })
}

export function useLoginState() {
    const [loginState, setLoginState] = React.useState<LoginState>({
        loading: true, 
        loggingIn: false, 
        user: null
    })
    const [loginRecoveryDone, setLoginRecoveryDone] = React.useState<boolean>(false)
    React.useEffect( () => {
        if (!loginRecoveryDone) {
            initialLogin(loginState, setLoginState)
            setLoginRecoveryDone(true)
        }
    }, [])
    return {loginState, setLoginState}
}


export function triggerGoogleSignIn(
    setLoginState: React.Dispatch<React.SetStateAction<LoginState>>, 
    e?:React.SyntheticEvent<HTMLElement, Event> 
) {
    if (e) e.preventDefault()
    console.log("attempting to log in ")
    setLoginState({loading: false, loggingIn: true, user: null })
    pb.collection('users').authWithOAuth2({ provider: 'google' }).then( async (data: any) => {
        console.log("login data: ", data)
        setLoginState({loading: false, loggingIn: false, user: await getFullUser(data.record.id, data.meta.name)
        })
    })

}

export function triggerSignOut(
    setLoginState: React.Dispatch<React.SetStateAction<LoginState>>,
    e?:React.SyntheticEvent<HTMLElement, Event>
) {
    if (e) e.preventDefault()
    pb.authStore.clear()
    setLoginState({loading: false, loggingIn: false, user: null })
}


export async function triggerEmailLogin(
    setLoginState: React.Dispatch<React.SetStateAction<LoginState>>,
    email: string,
    password: string
): Promise<boolean> {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password)
        if (authData.record.verified)
            setLoginState({ loading: false, loggingIn: false, user: await getFullUser(authData.record.id) })
        else throw new Error('login error')
        console.log('login OK')
        return true
    }
    catch (error) {
        console.log('login error TBD')
        setLoginState({ loading: false, loggingIn: false, user: null })
        return false
    }
}

export function triggerPasswordReset(email: string) {
    pb.collection('users').requestPasswordReset(email)
}

export async function createUser(name: string, email: string, password: string): Promise<boolean> {
    console.log('creating user ' + name)
    try {
        await pb.collection('users').create({email, password, passwordConfirm: password, name})
        await pb.collection('users').requestVerification(email)
        return true
    }
    catch (e) {
        console.log('error creating user!')
        return false
    }
}

export function changeUserName(id: string, name: string) {
    console.log('changing user name to ' + name)
    pb.collection('users').update(id, {name})
}
export function requestEmailChange(email: string) {
    console.log('sending email change request for' + email)
    pb.collection('users').requestEmailChange(email)
}
