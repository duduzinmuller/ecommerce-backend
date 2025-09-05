import { asaas } from "../../config/assas";
import { CreateCustomerParams } from "../../interfaces/customer";

export class CreateCustomerRepository {
  async execute(customerData: CreateCustomerParams) {
    try {
      const customer = await asaas.customers.new({
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj,
        phone: customerData.phone,
        mobilePhone: customerData.mobilePhone,
        postalCode: customerData.postalCode,
        address: customerData.address,
        addressNumber: customerData.addressNumber,
        complement: customerData.complement,
        province: customerData.province,
      });

      return customer;
    } catch (error) {
      console.error("Erro ao criar customer no Asaas:", error);
      throw new Error("Falha ao criar customer no Asaas");
    }
  }
}
