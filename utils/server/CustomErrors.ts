export class ExpectedError extends Error {
  constructor(message = '') {
    super(message);
  }
}

export class ServerError extends Error {
  constructor(message = '') {
    super(message);
  }
}
