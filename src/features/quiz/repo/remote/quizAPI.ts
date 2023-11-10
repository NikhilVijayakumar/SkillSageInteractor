//path src/features/quiz/repo/remote/quizAPI.ts

import { useApi } from '../../../../common/repo/useApi'
import { QuizResponse, QuizRequest } from '../data/quizData'
import ServerResponse from 'harmony_interactor_kit/src/common/repo/serverResponse'
import URL from '../../../../common/repo/apiUrl'

export const getQuiz = async (
  literal: Record<string, string>,
  request: QuizRequest,
): Promise<ServerResponse<QuizResponse>> => {
  return useApi(literal).post<QuizResponse>(URL.QUIZ_ENDPOINT, request)
}
