interface IAPIBaseResponse {
    code: number
}

interface IAPISuccessResponse<DType = any> extends IAPIBaseResponse {
    type: 'success'
    data: DType
    success: true
}

interface IAPIErrorResponse extends IAPIBaseResponse {
    type: 'error'
    error: string
    appCode: number
    success: false
}

export type IAPIResponse<T> = IAPISuccessResponse<T> | IAPIErrorResponse