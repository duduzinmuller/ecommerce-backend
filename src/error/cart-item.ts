export class IdCartAndProductId extends Error {
  constructor() {
    super("ID do carrinho e ID do produto são obrigatórios");
    this.name = "IdCartAndProductId";
  }
}

export class CartNotFoundError extends Error {
  constructor() {
    super("Carrinho não encontrado");
    this.name = "CartNotFoundError";
  }
}

export class EmptyCartError extends Error {
  constructor() {
    super("Carrinho vazio");
    this.name = "EmptyCartError";
  }
}
export class QuantityProductError extends Error {
  constructor() {
    super("Quantidade deve ser maior que zero");
    this.name = "QuantityProduct";
  }
}
