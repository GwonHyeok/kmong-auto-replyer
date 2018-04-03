import Inbox from "./Inbox";
import Partner from "../user/Partner";

export default class InboxMessages {
    USERID: number;
    partner: Partner;
    inboxes: Array<Inbox>;
    inboxGroupId: string;
    inboxTotalCount: number;
}
