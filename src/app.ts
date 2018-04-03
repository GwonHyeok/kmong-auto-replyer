import HttpClient from "./network/HttpClient";
import LoginApi from "./api/LoginApi";
import InboxApi from "./api/InboxApi";
import Inbox from "./model/inbox/Inbox";

export default class Application {

    private readonly kmongApiClient = HttpClient.createClient({
        baseUri: 'https://kmong.com/'
    });

    // 유저 정보, 인박스 읽지 않은 정보
    private userId: number;
    private unreadInboxMessages: Array<Inbox>;

    // 작업 정보
    private isAppRunning = true;
    private recentRunningTime: number;
    private pollingTime: number = 5000;

    async start() {
        console.log('Start Application');

        const loginApi = new LoginApi(this.kmongApiClient);
        const inboxApi = new InboxApi(this.kmongApiClient);

        // 로그인 요청
        await loginApi.login(process.env.KMONG_EMAIL, process.env.KMONG_PASSWORD);

        // 반복 작업
        while (this.isAppRunning) {
            if (Date.now() - this.recentRunningTime < this.pollingTime) continue;

            // Inbox List
            const inboxList = await inboxApi.list(1);

            // 유저 아이디 저장과, 읽지 않은 메세지 정보 저장
            this.userId = inboxList.data.USERID;
            this.unreadInboxMessages = inboxList.data.inboxGroups.filter(inbox => {
                return inbox.unreadCnt > 0
            });

            // 읽지 않은 메세지한테 자동응답 메세지 보내기
            while (this.unreadInboxMessages.length > 0) {
                const inbox = this.unreadInboxMessages.pop();
                const messageDetails = await inboxApi.getMessages(inbox.username);

                await inboxApi.send(
                    messageDetails.data.inboxGroupId,
                    this.userId,
                    messageDetails.data.partner.USERID,
                    '현재 부재중입니다. 잠시후 연락 드리도록 하겠습니다.!'
                );
            }

            // 최근 작업 완료시간 업데이트
            this.recentRunningTime = Date.now();
        }
    }
}
