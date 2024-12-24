/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PlayerList {
  /** ID */
  pk?: number;
  /**
   * F name
   * @minLength 1
   * @maxLength 30
   */
  f_name: string;
  /**
   * L name
   * @minLength 1
   * @maxLength 30
   */
  l_name: string;
  /**
   * Image player url
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  image_player_url?: string | null;
  /**
   * Date birthday
   * @format date
   */
  date_birthday: string;
  /**
   * Weight
   * @min -2147483648
   * @max 2147483647
   */
  weight: number;
  /**
   * Height
   * @min -2147483648
   * @max 2147483647
   */
  height: number;
  /**
   * Position
   * @minLength 1
   * @maxLength 30
   */
  position: string;
  /**
   * Number
   * @min -2147483648
   * @max 2147483647
   */
  number: number;
  /**
   * Birth place
   * @minLength 1
   * @maxLength 30
   */
  birth_place: string;
}

export interface PlayerDetail {
  /** ID */
  pk?: number;
  /** Status */
  status?: "active" | "deleted";
  /**
   * F name
   * @minLength 1
   * @maxLength 30
   */
  f_name: string;
  /**
   * L name
   * @minLength 1
   * @maxLength 30
   */
  l_name: string;
  /**
   * Image player url
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  image_player_url?: string | null;
  /**
   * Date birthday
   * @format date
   */
  date_birthday: string;
  /**
   * Weight
   * @min -2147483648
   * @max 2147483647
   */
  weight: number;
  /**
   * Height
   * @min -2147483648
   * @max 2147483647
   */
  height: number;
  /**
   * Position
   * @minLength 1
   * @maxLength 30
   */
  position: string;
  /**
   * Number
   * @min -2147483648
   * @max 2147483647
   */
  number: number;
  /**
   * Birth place
   * @minLength 1
   * @maxLength 30
   */
  birth_place: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8001" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8001
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class UnAuthApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  players = {
    /**
     * @description Получение списка игроков. Можно отфильтровать по его фамилии.
     *
     * @tags players
     * @name PlayersList
     * @request GET:/players/
     * @secure
     */
    playersList: (
      query?: {
        /**
         * Фамилия игрока
         * @default ""
         */
        l_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PlayerList[], any>({
        path: `/players/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить информацию о конкретном игроке по ID.
     *
     * @tags players
     * @name PlayersRead
     * @request GET:/players/{id}/
     * @secure
     */
    playersRead: (id: string, params: RequestParams = {}) =>
      this.request<PlayerDetail, any>({
        path: `/players/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}