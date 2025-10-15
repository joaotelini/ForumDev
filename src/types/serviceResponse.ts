export type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
  token?: string;
};