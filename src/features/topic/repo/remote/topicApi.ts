//path src/features/organization/repo/remote/organizationApi.ts

import { useApi } from '../../../../common/repo/useApi'
import { TopicResponse } from '../data/topicData'
import ServerResponse from 'harmony_interactor_kit/src/common/repo/serverResponse'
import URL from '../../../../common/repo/apiUrl'

export const getTopic = async (
  literal: Record<string, string>,
): Promise<ServerResponse<TopicResponse>> => {
  return useApi(literal).get<TopicResponse>(URL.TOPICS_ENDPOINT)
}
