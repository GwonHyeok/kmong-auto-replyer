import HttpClient from "../network/HttpClient";

export default class BaseApi {

    protected readonly httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

}
