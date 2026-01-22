export type GenericResponse<T = undefined> = T extends undefined
  ? { message: string }
  : {
      data: T;
      message: string;
    };

export type GenericErrorResponse = {
  name: string;
  message: string;
};
