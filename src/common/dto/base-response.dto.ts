export class BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown[] | null;

  constructor(partial: Partial<BaseResponse<T>>) {
    Object.assign(this, partial);
  }

  // response success
  static success<T>(data: T, message = 'Success'): BaseResponse<T> {
    return new BaseResponse<T>({
      success: true,
      message,
      data,
      errors: null,
    });
  }

  // response error
  static error(
    message: string,
    errors: unknown[] | null = null,
  ): BaseResponse<null> {
    return new BaseResponse<null>({
      success: false,
      message,
      data: null,
      errors,
    });
  }
}
