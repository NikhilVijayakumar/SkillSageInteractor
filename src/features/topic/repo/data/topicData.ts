//path src/features/organization/repo/data/organizationData.ts

import { AppState } from 'harmony_interactor_kit/src/common/state/appState'
import { EventType } from 'harmony_interactor_kit/src/common/event/eventType'
import { ListDataItem } from 'harmony_web_kit/src/common/components/list/genericListData'

export interface Topic extends ListDataItem {
  types: string[]
}

export type TopicList = Topic[]

export interface TopicResponse {
  data: {
    topics: TopicList
  }
  status: string
}

export interface TopicListProps {
  appstate: TopicListState<TopicList>
  literal: Record<string, string>
  gotoExam: (topic: Topic) => void
}

export interface TopicListState<TopicList> extends AppState<TopicList> {
  event: EventType
  selectedData?: Topic
}
