# 크몽 메세지 자동 응답기

> 읽지 않은 메세지를 자동으로 답장해줍니다



5초에 한번씩 유저의 인박스 리스트를 확인하고, 읽지 않은 메세지가 있을 경우.

유저가 선택한 메세지가 해당 파트너한테 자동으로 전송되게 됩니다.

~~여담으로 메세지 응답률도 높일 수 있다는 소문이 있습니다~~

## 사용 방법

*현재는 이메일 로그인 유저만 사용 가능합니다*

1. Clone

```bash
git clone https://github.com/GwonHyeok/kmong-auto-replyer.git
```

2. Environment 설정

```bash
KMONG_EMAIL=YOUR_KMONG_EMAIL
KMONG_PASSWORD=YOUR_KMONG_PASSWORD
KMONG_MESSAGE=YOUR_CUSTOM_REPLY
```

3. 시작

```bash
npm start
```



## 설정

| 키             | 필수여부 |                    기본 값                    |
| :------------- | :------: | :-------------------------------------------: |
| KMONG_EMAIL    |   필수   |                       -                       |
| KMONG_PASSWORD |   필수   |                       -                       |
| KMONG_MESSAGE  |   선택   | 안녕하세요, ${userName}님 현재 부재중 입니다. |

