import { registrationApi as api } from '../repo/remote/registrationApi'
import {
  RegistrationResponse,
  RegistrationState,
  RegistrationEmailState,
  RegistrationPasswordState,
} from '../repo/data/registrationData'
import { useState } from 'react'

import { HttpStatusCode } from 'harmony_interactor_kit/src/common/repo/httpStatusCode'
import { StateType } from 'harmony_interactor_kit/src/common/state/stateType'
import useStatusMessage from 'harmony_interactor_kit/src/common/repo/useStatusMessage'

const useRegistration = (literal: Record<string, string>) => {
  const [appstate, setAppState] = useState<
    RegistrationState<RegistrationResponse>
  >({
    state: StateType.INIT,
    isError: false,
    isSuccess: false,
    status: HttpStatusCode.IDLE,
    statusMessage: '',
    data: undefined,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    userName: '',
    confirmPassword: '',
    confirmPasswordValid: false,
  })

  const setState = (
    emailState: RegistrationEmailState | null,
    passwordState: RegistrationPasswordState | null,
    userName: string | null,
    confirmPassword: RegistrationPasswordState | null,
  ) => {
    if (emailState) {
      console.log('emailState', emailState)
      setAppState((prevState) => ({
        ...prevState,
        email: emailState.email,
        emailValid: emailState.emailValid,
      }))
    }
    if (passwordState) {
      console.log('passwordState', passwordState)
      setAppState((prevState) => ({
        ...prevState,
        password: passwordState.password,
        passwordValid: passwordState.passwordValid,
      }))
    }
    if (userName !== null) {
      setAppState((prevState) => ({
        ...prevState,
        userName,
      }))
    }
    if (confirmPassword !== null) {
      setAppState((prevState) => ({
        ...prevState,
        confirmPassword: confirmPassword.password,
      }))
    }
  }

  const handleRegistration = async () => {
    if (!appstate.emailValid) {
      return
    }
    if (!appstate.passwordValid) {
      return
    }

    const request = {
      userName: appstate.userName,
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
        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isSuccess: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
          data: response.data!!,
        }))
      } else {
        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isError: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
        }))
      }
    } catch (error) {
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
    handleRegistration,
  }
}

export default useRegistration
