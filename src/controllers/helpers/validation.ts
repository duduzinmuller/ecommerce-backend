import { badRequest } from "./http";

import validator from "validator";

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);

export const invalidIdResponse = (message: string) =>
  badRequest("Este ID e invalído.");

export const requiredFieldsIsMissingResponse = (field: string) =>
  badRequest(`O campo ${field} e obrigatório.`);

export const invalidSlugResponse = () => badRequest("O slug e obrigatorio");

export const requiredCartIdResponse = () =>
  badRequest("O ID do carrinho é obrigatório.");
