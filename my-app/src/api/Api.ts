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

export interface AcceptTeam {
  /** Accept */
  accept: boolean;
}

export interface Team {
  /** ID */
  pk?: number;
  /**
   * Name team
   * @minLength 1
   * @maxLength 100
   */
  name_team: string;
  /**
   * Competition
   * @minLength 1
   * @maxLength 30
   */
  competition: string;
  /**
   * Date competition
   * @format date
   */
  date_competition?: string | null;
  /** Status */
  status?: "draft" | "formed" | "completed" | "cancelled" | "deleted";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /**
   * Username
   * @minLength 1
   * @maxLength 30
   */
  username?: string | null;
  /** Moderator */
  moderator?: number | null;
}

export interface AuthToken {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
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

export interface AddImage {
  /** Player id */
  player_id: number;
  /**
   * Image player url
   * @minLength 1
   */
  image_player_url: string;
}

export interface UserUpdate {
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string;
}

export interface UserRegistration {
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface PutTeam {
  /**
   * Name team
   * @minLength 1
   */
  name_team: string;
  /**
   * Competition
   * @minLength 1
   */
  competition: string;
  /**
   * Date competition
   * @format date
   */
  date_competition: string;
  /** Status */
  status?: "draft" | "formed" | "completed" | "cancelled" | "deleted";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /**
   * Username
   * @minLength 1
   * @maxLength 30
   */
  username?: string | null;
  /** Moderator */
  moderator?: number | null;
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
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
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
 * @baseUrl http://127.0.0.1:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  addIsCaptain = {
    /**
     * @description Update the price of a threat in a request.
     *
     * @tags add-is_captain
     * @name AddIsCaptainPlayerUpdate
     * @request PUT:/add-is_captain/{team_pk}/player/{player_pk}/
     * @secure
     */
    addIsCaptainPlayerUpdate: (
      teamPk: string,
      playerPk: string,
      data: {
        /** Капитан команды */
        is_captain: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/add-is_captain/${teamPk}/player/${playerPk}/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Remove a threat from a request.
     *
     * @tags add-is_captain
     * @name AddIsCaptainPlayerDelete
     * @request DELETE:/add-is_captain/{team_pk}/player/{player_pk}/
     * @secure
     */
    addIsCaptainPlayerDelete: (teamPk: string, playerPk: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/add-is_captain/${teamPk}/player/${playerPk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  deleteFromTeam = {
    /**
     * @description Update the price of a threat in a request.
     *
     * @tags delete-from-team
     * @name DeleteFromTeamPlayerUpdate
     * @request PUT:/delete-from-team/{team_pk}/player/{player_pk}/
     * @secure
     */
    deleteFromTeamPlayerUpdate: (
      teamPk: string,
      playerPk: string,
      data: {
        /** Капитан команды */
        is_captain: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/delete-from-team/${teamPk}/player/${playerPk}/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Remove a threat from a request.
     *
     * @tags delete-from-team
     * @name DeleteFromTeamPlayerDelete
     * @request DELETE:/delete-from-team/{team_pk}/player/{player_pk}/
     * @secure
     */
    deleteFromTeamPlayerDelete: (teamPk: string, playerPk: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/delete-from-team/${teamPk}/player/${playerPk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  deleteTeam = {
    /**
     * @description Approve or decline a request (for moderators).
     *
     * @tags delete-team
     * @name DeleteTeamUpdate
     * @request PUT:/delete-team/{id}/
     * @secure
     */
    deleteTeamUpdate: (id: string, data: AcceptTeam, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/delete-team/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete a request (for moderators).
     *
     * @tags delete-team
     * @name DeleteTeamDelete
     * @request DELETE:/delete-team/{id}/
     * @secure
     */
    deleteTeamDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/delete-team/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  formTeam = {
    /**
     * @description Mark a request as formed. Only available for requests with a 'draft' status.
     *
     * @tags form-team
     * @name FormTeamUpdate
     * @request PUT:/form-team/{id}/
     * @secure
     */
    formTeamUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/form-team/${id}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  listTeams = {
    /**
     * @description Get a list of requests. Optionally filter by date and status.
     *
     * @tags list-teams
     * @name ListTeamsList
     * @request GET:/list-teams/
     * @secure
     */
    listTeamsList: (
      query?: {
        /**
         * Filter requests after a specific date
         * @format date
         */
        date?: string;
        /** Filter requests by status */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Team[], any>({
        path: `/list-teams/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Аунтификация пользователя с логином и паролем. Возвращает файл cookie сеанса в случае успеха.
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: AuthToken, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  logout = {
    /**
     * @description Выход аунтифицированного пользователя. Удаление сессии.
     *
     * @tags logout
     * @name LogoutCreate
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  moderateTeam = {
    /**
     * @description Approve or decline a request (for moderators).
     *
     * @tags moderate-team
     * @name ModerateTeamUpdate
     * @request PUT:/moderate-team/{id}/
     * @secure
     */
    moderateTeamUpdate: (id: string, data: AcceptTeam, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/moderate-team/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete a request (for moderators).
     *
     * @tags moderate-team
     * @name ModerateTeamDelete
     * @request DELETE:/moderate-team/{id}/
     * @secure
     */
    moderateTeamDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/moderate-team/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  players = {
    /**
     * @description Добавление игрока в заявку-черновик пользователя. Создается новая заявка, если не существует заявки-черновика
     *
     * @tags players
     * @name PlayersAddCreate
     * @request POST:/players/add/{id}/
     * @secure
     */
    playersAddCreate: (
      id: number,
      data: {
        /**
         * Капитан?
         * @example 1
         */
        is_captain?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/players/add/${id}/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Получить информацию о конкретном игроке по ID.
     *
     * @tags players
     * @name PlayersCreateList
     * @request GET:/players/create/
     * @secure
     */
    playersCreateList: (params: RequestParams = {}) =>
      this.request<PlayerDetail, any>({
        path: `/players/create/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавление нового игрока (moderators only).
     *
     * @tags players
     * @name PlayersCreateCreate
     * @request POST:/players/create/
     * @secure
     */
    playersCreateCreate: (data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/create/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление данных игрока (moderators only).
     *
     * @tags players
     * @name PlayersCreateUpdate
     * @request PUT:/players/create/
     * @secure
     */
    playersCreateUpdate: (data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/create/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление игрока по ID (moderators only).
     *
     * @tags players
     * @name PlayersCreateDelete
     * @request DELETE:/players/create/
     * @secure
     */
    playersCreateDelete: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/players/create/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Получить информацию о конкретном игроке по ID.
     *
     * @tags players
     * @name PlayersDeleteRead
     * @request GET:/players/delete/{id}/
     * @secure
     */
    playersDeleteRead: (id: string, params: RequestParams = {}) =>
      this.request<PlayerDetail, any>({
        path: `/players/delete/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавление нового игрока (moderators only).
     *
     * @tags players
     * @name PlayersDeleteCreate
     * @request POST:/players/delete/{id}/
     * @secure
     */
    playersDeleteCreate: (id: string, data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/delete/${id}/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление данных игрока (moderators only).
     *
     * @tags players
     * @name PlayersDeleteUpdate
     * @request PUT:/players/delete/{id}/
     * @secure
     */
    playersDeleteUpdate: (id: string, data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/delete/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление игрока по ID (moderators only).
     *
     * @tags players
     * @name PlayersDeleteDelete
     * @request DELETE:/players/delete/{id}/
     * @secure
     */
    playersDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/players/delete/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Upload an image for a specific threat.
     *
     * @tags players
     * @name PlayersImageCreate
     * @request POST:/players/image/
     * @secure
     */
    playersImageCreate: (data: AddImage, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/players/image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Получить информацию о конкретном игроке по ID.
     *
     * @tags players
     * @name PlayersUpdateRead
     * @request GET:/players/update/{id}/
     * @secure
     */
    playersUpdateRead: (id: string, params: RequestParams = {}) =>
      this.request<PlayerDetail, any>({
        path: `/players/update/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавление нового игрока (moderators only).
     *
     * @tags players
     * @name PlayersUpdateCreate
     * @request POST:/players/update/{id}/
     * @secure
     */
    playersUpdateCreate: (id: string, data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/update/${id}/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление данных игрока (moderators only).
     *
     * @tags players
     * @name PlayersUpdateUpdate
     * @request PUT:/players/update/{id}/
     * @secure
     */
    playersUpdateUpdate: (id: string, data: PlayerDetail, params: RequestParams = {}) =>
      this.request<PlayerDetail, void>({
        path: `/players/update/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление игрока по ID (moderators only).
     *
     * @tags players
     * @name PlayersUpdateDelete
     * @request DELETE:/players/update/{id}/
     * @secure
     */
    playersUpdateDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/players/update/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  profile = {
    /**
     * @description Обновление профиля аунтифицированного пользователя
     *
     * @tags profile
     * @name ProfileUpdate
     * @request PUT:/profile/
     * @secure
     */
    profileUpdate: (data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserUpdate, void>({
        path: `/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * @description Регистрация нового пользователя.
     *
     * @tags register
     * @name RegisterCreate
     * @request POST:/register/
     * @secure
     */
    registerCreate: (data: UserRegistration, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  requestList = {
    /**
     * No description
     *
     * @tags request_list
     * @name RequestListList
     * @request GET:/request_list/
     * @secure
     */
    requestListList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/request_list/`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  team = {
    /**
     * @description Get details of a request by ID, including associated threats.
     *
     * @tags team
     * @name TeamRead
     * @request GET:/team/{id}/
     * @secure
     */
    teamRead: (id: string, params: RequestParams = {}) =>
      this.request<Team, any>({
        path: `/team/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a request by ID.
     *
     * @tags team
     * @name TeamUpdate
     * @request PUT:/team/{id}/
     * @secure
     */
    teamUpdate: (id: string, data: PutTeam, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/team/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
