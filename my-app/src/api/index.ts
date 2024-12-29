import { Api } from './Api';
import { UnAuthApi } from "./UnauthApi";

export const api = new Api({
    baseURL: 'http://localhost:3000/api'
});

export const unauthApi = new UnAuthApi({
    baseURL: 'http://localhost:3000/unauth'
});