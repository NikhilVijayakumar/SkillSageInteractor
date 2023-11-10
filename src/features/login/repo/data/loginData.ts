// src/features/login/store/types/loginTypes.ts

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

export type LoginRequest = {
  email: string
  password: string
}

export type LoginEmailState = EmailState
export type LoginPasswordState = PasswordState

export interface LoginState<AuthUser>
  extends EmailState,
    PasswordState,
    AppState<AuthUser> {}

export interface LoginResponse {
  data: {
    user: AuthUser
  }
}

export interface LoginProps {
  literal: Record<string, string>
  appstate: LoginState<AuthUser>
  handleLogin: () => Promise<void>
  setState: (
    emailState: LoginEmailState | null,
    passwordState: LoginPasswordState | null,
  ) => void
  setUser: (user: AuthUser) => void
}
