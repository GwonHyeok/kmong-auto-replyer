import HttpClient from "./network/HttpClient";
import LoginApi from "./api/LoginApi";
import InboxApi from "./api/InboxApi";
import Inbox from "./model/inbox/Inbox";
import Log from "./util/Log";

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
        Log.d('크몽 자동 메세지 응답기 실행');

        const loginApi = new LoginApi(this.kmongApiClient);
        const inboxApi = new InboxApi(this.kmongApiClient);

        // 로그인 요청
        if (process.env.KMONG_EMAIL == null) throw Error('크몽 이메일이 설정 되어 있지 않습니다');
        if (process.env.KMONG_PASSWORD == null) throw Error('크몽 비밀번호가 설정 되어 있지 않습니다');
        const loginResponse = await loginApi.login(process.env.KMONG_EMAIL, process.env.KMONG_PASSWORD);
        if (loginResponse.meta.status !== 1) throw Error('크몽 로그인에 실패하였습니다');

        // 반복 작업
        while (this.isAppRunning) {
            if (Date.now() - this.recentRunningTime < this.pollingTime) continue;

            // Inbox List
            const inboxList = await inboxApi.list(1);
            Log.d('인박스 리스트 검색');

            // 유저 아이디 저장과, 읽지 않은 메세지 정보 저장
            this.userId = inboxList.data.USERID;
            this.unreadInboxMessages = inboxList.data.inboxGroups.filter(inbox => {
                return inbox.unreadCnt > 0
            });
            Log.d(`필터링된 인박스 갯수 : ${this.unreadInboxMessages.length}`);

            // 읽지 않은 메세지한테 자동응답 메세지 보내기
            while (this.unreadInboxMessages.length > 0) {
                const inbox = this.unreadInboxMessages.pop();
                const messageDetails = await inboxApi.getMessages(inbox.username);
                await inboxApi.send(
                    messageDetails.data.inboxGroupId,
                    this.userId,
                    messageDetails.data.partner.USERID,
                    '현재 부재중입니다. 잠시후 연락 드리도록 하겠습니다!!'
                );
                Log.d(`자동 응답 메세지 전송 : (${this.userId}) -> (${messageDetails.data.partner.USERID})`)
            }

            // 최근 작업 완료시간 업데이트
            this.recentRunningTime = Date.now();
        }
    }
}
