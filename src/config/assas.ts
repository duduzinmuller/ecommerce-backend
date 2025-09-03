import { AsaasClient } from "asaas";

export const asaas = new AsaasClient(process.env.ASAAS_API_KEY!, {
  sandboxUrl: "https://sandbox.asaas.com/api/v3",
  printError: false,
});
