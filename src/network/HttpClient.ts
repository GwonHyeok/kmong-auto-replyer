import rp = require('request-promise');
import url = require('url');
import { CookieJar } from "request";

export class HttpClientOptions {
    baseUri: string
}

export default class HttpClient {

    private static instance: HttpClient;
    private readonly request;
    private readonly cookieJar: CookieJar;
    private readonly clientOptions: HttpClientOptions;

    private constructor(httpClientOptions: HttpClientOptions) {
        this.request = rp;
        this.cookieJar = rp.jar();
        this.clientOptions = httpClientOptions;
    }

    static createClient(httpClientOptions: HttpClientOptions = null) {
        return new HttpClient(httpClientOptions);
    }

    static getInstance(httpClientOptions: HttpClientOptions = null) {
        if (this.instance == null) {
            this.instance = new HttpClient(httpClientOptions);
        }
        return this.instance;
    }

    async get(options) {
        if (this.clientOptions.baseUri) {
            options.uri = url.resolve(this.clientOptions.baseUri, options.uri)
        }

        return this.request(Object.assign(
            { jar: this.cookieJar },
            { method: 'GET' },
            options)
        );
    }

    async post(options) {
        if (this.clientOptions.baseUri) {
            options.uri = `${this.clientOptions.baseUri}/${options.uri}`
        }

        return this.request(Object.assign(
            { jar: this.cookieJar },
            { method: 'POST' },
            options)
        );
    }

}
