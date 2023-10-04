export enum APIResponseType {
    //유저 가입 여부
    'USER_REGISTERED',
    'USER_REGISTERED_FAILED',
    'USER_NOT_REGISTERED',
    'USER_ALREADY_REGISTERED',
    // 데이터 상태
    'DATA_NOT_FOUND',
    'DATA_FOUND',
    'DATA_UPDATED',
    'DATA_DELETED',
    'DATA_CREATED',
    'DATA_NOT_CREATED',
    'DATA_NOT_UPDATED',
    'DATA_NOT_DELETED',
}

export type APIResponse = { status: APIResponseType, data?: any }