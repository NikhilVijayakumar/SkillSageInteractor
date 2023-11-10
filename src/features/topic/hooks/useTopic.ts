//path:- src/features/orgnization/hooks/useOrganization.ts
import { getTopic as api } from '../repo/remote/topicApi'
import {
  TopicResponse,
  TopicList,
  TopicListState,
  Topic,
} from '../repo/data/topicData'
import { useState, useEffect } from 'react'
import { HttpStatusCode } from 'harmony_interactor_kit/src/common/repo/httpStatusCode'
import { StateType } from 'harmony_interactor_kit/src/common/state/stateType'
import useStatusMessage from 'harmony_interactor_kit/src/common/repo/useStatusMessage'
import { EventType } from 'harmony_interactor_kit/src/common/event/eventType'

const useTopic = (literal: Record<string, string>) => {
  const [appstate, setAppState] = useState<TopicListState<TopicList>>({
    state: StateType.INIT,
    isError: false,
    isSuccess: false,
    status: HttpStatusCode.IDLE,
    statusMessage: '',
    data: undefined,
    event: EventType.IDLE,
  })

  const gotoExam = (topic: Topic) => {
    setAppState((prevState) => ({
      ...prevState,
      selectedData: topic,
      event: EventType.NEXT,
    }))
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setAppState((prevState) => ({
      ...prevState,
      state: StateType.LOADING,
    }))
    try {
      const response = await api(literal)
      if (response.isSuccess && response.data) {
        const topicResponse: TopicResponse = response.data
        setAppState((prevState) => ({
          ...prevState,
          state: StateType.COMPLETED,
          isSuccess: true,
          status: response.status,
          statusMessage: useStatusMessage(response.status, literal),
          data: topicResponse.data.topics,
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
    gotoExam,
  }
}

export default useTopic
