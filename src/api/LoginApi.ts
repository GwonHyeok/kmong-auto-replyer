import BaseApi from "./BaseApi";
import LoginResponse from "../model/login/LoginResponse";

export default class LoginApi extends BaseApi {

    async login(email: string, password: string): Promise<LoginResponse> {
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
