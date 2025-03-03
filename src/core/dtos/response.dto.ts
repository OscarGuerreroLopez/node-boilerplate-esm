export interface SuccessResponse<T> {
  serviceName: string;
  data?: T;
}

export interface MetaResponseDto {
  message: string;
  code: string;
  platform: string;
  environment: string;
  dbName: string;
}
