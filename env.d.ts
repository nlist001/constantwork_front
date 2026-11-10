/// <reference types="vite/client" />
import 'axios';

declare module 'axios' {
  export interface AxiosInstance {
    // Переопределяем методы, чтобы они возвращали T напрямую, а не AxiosResponse<T>
    get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}