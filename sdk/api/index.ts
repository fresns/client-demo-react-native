export enum EApiCode {
  Success = 0,
}

export type ApiResp<T> = {
  code: EApiCode;
  data: T;
  message: string;
};

export type ApiRespPromise<T> = Promise<ApiResp<T>>;
