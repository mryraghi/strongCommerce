export class ErrorObject {
  statusCode: number;
  error: string;
  message: string;

  constructor(error: ErrorObject) {
    this.statusCode = error.statusCode;
    this.error = error.error;
    this.message = error.message;
  }
}
