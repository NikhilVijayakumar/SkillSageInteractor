// src/features/registration/repo/remote/registrationApi.ts

import { useApi } from '../../../../common/repo/useApi'
import {
  RegistrationRequest,
  RegistrationResponse,
} from '../data/registrationData'
import ServerResponse from 'harmony_interactor_kit/src/common/repo/serverResponse'
import URL from '../../../../common/repo/apiUrl'

export const registrationApi = async (
  registrationRequest: RegistrationRequest,
  literal: Record<string, string>,
): Promise<ServerResponse<RegistrationResponse>> => {
  return useApi(literal).post<RegistrationResponse>(
    URL.REGISTRATION_ENDPOINT,
    registrationRequest,
  )
}
