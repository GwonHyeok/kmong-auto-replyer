import BaseApi from "./BaseApi";
import InboxListResponse from "../model/inbox/InboxListResponse";
import InboxMessagesResponse from "../model/inbox/InboxMessagesResponse";

export default class InboxApi extends BaseApi {

    async index() {
        return this.httpClient.get({
            uri: '/inbox',
            json: true
        })
    }

    async list(page: number, type: string = 'GENERAL'): Promise<InboxListResponse> {
        return this.httpClient.get({
            uri: '/inbox',
            qs: {
                page: page,
                type: type
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            json: true
        })
    }

    async getMessages(partnerUserName: string, isLoadedMoreMessages: boolean = false): Promise<InboxMessagesResponse> {
        return this.httpClient.get({
            uri: '/inbox/get_inbox_messages',
            qs: {
                username: partnerUserName,
                isLoadedMoreMessages: isLoadedMoreMessages
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            json: true
        })
    }

    async send(inboxGroupId: string, from: number, to: number, message: string) {
        return this.httpClient.post({
            uri: '/inbox',
            form: {
                FID: [],
                MSGFROM: from,
                MSGTO: to,
                action: "MESSAGE",
                hasKeywords: false,
                inbox_group_id: inboxGroupId,
                keywordData: [],
                message: message,
                relatedSubjectId: null,
                unread: -1
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            json: true
        })
    }

}
