// src/features/registration/repo/data/registrationData.ts
import { AppState } from 'harmony_interactor_kit/src/common/state/appState'
import {
  EmailState,
  PasswordState,
} from 'harmony_web_kit/src/common/components/form/formData'


type User = {
  token: string
  userName: string
  email: string
}

export type AuthUser = User | null

export interface RegistrationData {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export type RegistrationRequest = {
  email: string
  password: string
  userName: string
}

export type RegistrationEmailState = EmailState
export type RegistrationPasswordState = PasswordState

export interface RegistrationState<RegistrationResponse>
  extends EmailState,
    PasswordState,
    AppState<RegistrationResponse> {
  data: RegistrationResponse | undefined
  userName: string
  confirmPassword: string
  confirmPasswordValid: boolean
}

export type RegistrationResponse = {
  message: string
  user: AuthUser
}

export interface RegistrationConfirmPasswordState {
  confirmPassword: string
  confirmPasswordValid: boolean
}

export interface RegistrationProps {
  literal: Record<string, string>
  appstate: RegistrationState<RegistrationResponse>
  handleRegistration: () => Promise<void>
  setState: (
    emailState: RegistrationEmailState | null,
    passwordState: RegistrationPasswordState | null,
    userName: string | null,
    confirmPassword: RegistrationPasswordState | null,
  ) => void
}
