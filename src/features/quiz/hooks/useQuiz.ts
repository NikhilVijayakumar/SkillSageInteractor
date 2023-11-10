//path:- src/features/quiz/hooks/useQuiz.ts

import { getQuiz as api } from '../repo/remote/quizAPI'
import {
  QuizTopic,
  QuizState,
  QuizResponse,
  Quiz,
  QuizRequest,
} from '../repo/data/quizData'
import { useState } from 'react'
import { HttpStatusCode } from 'harmony_interactor_kit/src/common/repo/httpStatusCode'
import { StateType } from 'harmony_interactor_kit/src/common/state/stateType'
import useStatusMessage from 'harmony_interactor_kit/src/common/repo/useStatusMessage'
import { EventType } from 'harmony_interactor_kit/src/common/event/eventType'
import { shuffleArray } from 'harmony_interactor_kit/src/common/utils/arrayUtils'

const useQuiz = (literal: Record<string, string>) => {
  const [appstate, setAppState] = useState<QuizState<Quiz>>({
    state: StateType.INIT,
    isError: false,
    isSuccess: false,
    status: HttpStatusCode.IDLE,
    statusMessage: '',
    data: undefined,
    validationError: false,
    quiz: [],
    currentQuestionIndex: 0,
    selectedAnswer: '',
    correctAnswers: 0,
    chapterResults: [],
    eventType: EventType.IDLE,
  })

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    appstate.selectedAnswer = (event.target as HTMLInputElement).value
  }

  const handleSubmit = () => {
    let answer = appstate.correctAnswers
    let chapterName = appstate.quiz[appstate.currentQuestionIndex].chaptername
    let chapterResult = appstate.chapterResults.find(
      (result) => result.chapterName === chapterName,
    )
    if (!chapterResult) {
      console.log('Chapter result not found')
      return
    }
    if (appstate.selectedAnswer === '') {
      setAppState((prevState) => ({
        ...prevState,
        validationError: true,
        eventType: EventType.NEXT,
      }))
      return
    }
    if (
      appstate.selectedAnswer ===
      appstate.quiz[appstate.currentQuestionIndex].question.correct_answer
    ) {
      answer++
      chapterResult.correctAnswers++
    }

    if (appstate.currentQuestionIndex < appstate.quiz.length - 1) {
      appstate.currentQuestionIndex = appstate.currentQuestionIndex + 1
      appstate.selectedAnswer = ''
      setAppState((prevState) => ({
        ...prevState,
        correctAnswers: answer,
        selectedAnswer: '',
        validationError: false,
        eventType: EventType.NEXT,
      }))
    } else {
      setAppState((prevState) => ({
        ...prevState,
        correctAnswers: answer,
        validationError: false,
        eventType: EventType.COMPLETED,
      }))
    }
  }

  const handleRestart = () => {
    appstate.currentQuestionIndex = 0
    appstate.selectedAnswer = ''
    appstate.correctAnswers = 0
    setAppState((prevState) => ({
      ...prevState,
      validationError: false,
      currentQuestionIndex: 0,
      selectedAnswer: '',
      correctAnswers: 0,
      chapterResults: [],
      eventType: EventType.NEXT,
    }))
  }

  const fetchQuiz = async (quizdata: QuizTopic) => {
    setAppState((prevState) => ({
      ...prevState,
      state: StateType.LOADING,
    }))
    try {
      const request: QuizRequest = { topic: quizdata.name, type: quizdata.type }
      const response = await api(literal, request)
      if (response.isSuccess && response.data) {
        const quizResponse: QuizResponse = response.data
        const uniqueChapterNames = [
          ...new Set(quizResponse.data.map((item) => item.chaptername)),
        ]

        const chapterResults = uniqueChapterNames.map((chapterName) => ({
          chapterName,
          totalQuestions: quizResponse.data.filter(
            (quiz) => quiz.chaptername === chapterName,
          ).length,
          correctAnswers: 0,
        }))

        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isSuccess: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
          data: quizResponse.data,
          quiz: shuffleArray(quizResponse.data),
          eventType: EventType.NEXT,
          chapterResults: chapterResults,
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
    fetchQuiz,
    handleRadioChange,
    handleSubmit,
    handleRestart,
  }
}

export default useQuiz
