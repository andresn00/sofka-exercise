export type ToastType = 'success' | 'error';

export type ToastData = {
  message: string;
  type: ToastType;
  delay: number;
};
