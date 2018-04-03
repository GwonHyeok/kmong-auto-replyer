import BaseApi from "./BaseApi";

export default class LoginApi extends BaseApi {

    async login(email: string, password: string) {
        return this.httpClient.post({
            uri: '/login',
            form: {
                email: email,
                password: password
            },
            json: true
        })
    }

}
