import { AsaasClient } from "asaas";

export const asaas = new AsaasClient(process.env.ASAAS_API_KEY!, {
  printError: true,
  sandbox: false,
});
