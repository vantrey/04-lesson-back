export interface IErrorMessage {
  message: string;
  field: string;
}

export const getErrorResponse = (errors: IErrorMessage[]) => {
  return {
    errorsMessages: errors,
  };
};
