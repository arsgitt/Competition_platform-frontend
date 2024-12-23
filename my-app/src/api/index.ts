import { Api } from './Api';
import { UnAuthApi } from "./UnauthApi";

export const api = new Api({
    baseURL: 'http://localhost:5173/api'
});

export const unauthApi = new UnAuthApi({
    baseURL: 'http://localhost:5173/unauth'
});