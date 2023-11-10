import { loginApi as api } from '../repo/remote/loginApi'
import {
  LoginState,
  LoginEmailState,
  LoginPasswordState,
  AuthUser
} from '../repo/data/loginData'
import { useState } from 'react'
import { HttpStatusCode } from 'harmony_interactor_kit/src/common/repo/httpStatusCode'
import { StateType } from 'harmony_interactor_kit/src/common/state/stateType'
import useStatusMessage from 'harmony_interactor_kit/src/common/repo/useStatusMessage'


const useLogin = (literal: Record<string, string>) => {
  const [appstate, setAppState] = useState<LoginState<AuthUser>>({
    state: StateType.INIT,
    isError: false,
    isSuccess: false,
    status: HttpStatusCode.IDLE,
    statusMessage: '',
    data: null,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
  })

  const setState = (
    emailState: LoginEmailState | null,
    passwordState: LoginPasswordState | null,
  ) => {
    if (emailState) {
      setAppState((prevState) => ({
        ...prevState,
        email: emailState.email,
        emailValid: emailState.emailValid,
      }))
    }
    if (passwordState) {
      setAppState((prevState) => ({
        ...prevState,
        password: passwordState.password,
        passwordValid: passwordState.passwordValid,
      }))
    }
  }

  const handleLogin = async () => {
    if (!appstate.emailValid) {
      return
    }
    if (!appstate.passwordValid) {
      return
    }
    const request = {
      email: appstate.email,
      password: appstate.password,
    }

    setAppState((prevState) => ({
      ...prevState,
      state: StateType.LOADING,
    }))

    try {
      const response = await api(request, literal)
      if (
        response.isSuccess &&
        response.data !== null &&
        response.data !== undefined
      ) {
        console.log('Login Success', response.data)
        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isSuccess: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
          data: response.data!!.data.user,
        }))
      } else {
        console.log('else Login Failed')
        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isError: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
        }))
      }
    } catch (error) {
      console.log('catch Login Failed')
      setAppState((prevState) => ({
        ...prevState,
        state: StateType.COMPLETED,
        isError: true,
        status: HttpStatusCode.INTERNET_ERROR,
        statusMessage: useStatusMessage(HttpStatusCode.INTERNET_ERROR, literal),
      }))
    }
  }

  return {
    appstate,
    setState,
    handleLogin,
  }
}

export default useLogin
