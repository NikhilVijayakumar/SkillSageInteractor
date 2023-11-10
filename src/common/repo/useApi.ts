//path src/common/repo/apiService.ts
import ApiService from 'harmony_interactor_kit/src/common/repo/apiService'
export const useApi = (literal: Record<string, string>, authToken?: string) => {
  const BASE_URL = import.meta.env.VITE_REACT_APP_HOST
  return ApiService.getInstance(literal, BASE_URL, authToken)
}
