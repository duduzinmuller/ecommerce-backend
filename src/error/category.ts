export class SlugAlreadyInCreateError extends Error {
  constructor(slug: string) {
    super(`O slug ${slug} ja foi criado.`);
    this.name = "SlugAlreadyInCreateError";
  }
}

export class CategoryIsNotFound extends Error {
  constructor() {
    super("Categoria não encontrada");
    this.name = "CategoryIsNotFound";
  }
}
