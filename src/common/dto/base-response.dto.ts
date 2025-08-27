export class BaseResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];

  private constructor(
    success: boolean,
    message: string,
    data: T | null,
    errors: string[] = [],
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(data: T, message = 'Success'): BaseResponse<T> {
    return new BaseResponse<T>(true, message, data, []);
  }

  static error<T = null>(
    message = 'Error',
    errors: string[] = [],
  ): BaseResponse<T> {
    return new BaseResponse<T>(false, message, null, errors);
  }
}
