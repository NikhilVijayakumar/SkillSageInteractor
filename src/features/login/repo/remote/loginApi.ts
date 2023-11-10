// src/features/login/repo/remote/loginApi.ts
import { useApi } from '../../../../common/repo/useApi'
import { LoginRequest, LoginResponse } from '../data/loginData'
import ServerResponse from 'harmony_interactor_kit/src/common/repo/serverResponse'
import URL from '../../../../common/repo/apiUrl'

export const loginApi = async (
  loginRequest: LoginRequest,
  literal: Record<string, string>,
): Promise<ServerResponse<LoginResponse>> => {
  return useApi(literal).post<LoginResponse>(URL.LOGIN_ENDPOINT, loginRequest)
}
