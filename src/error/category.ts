export class SlugAlreadyInCreateError extends Error {
  constructor(slug: string) {
    super(`O slug ${slug} ja foi criado.`);
    this.name = "SlugAlreadyInCreateError";
  }
}
