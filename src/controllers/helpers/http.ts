export const created = <T>(body: T) => ({
  statusCode: 201,
  body,
});

export const ok = <T>(body: T) => ({
  statusCode: 200,
  body,
});

export const badRequest = (message: string) => ({
  statusCode: 400,
  body: { error: message },
});

export const unauthorized = (message: string) => ({
  statusCode: 401,
  body: { error: message },
});

export const forbidden = (message: string) => ({
  statusCode: 403,
  body: { error: message },
});

export const notFound = (message: string) => ({
  statusCode: 404,
  body: { error: message },
});

export const serverError = (message: string = "Erro interno no servidor") => ({
  statusCode: 500,
  body: { error: message },
});
