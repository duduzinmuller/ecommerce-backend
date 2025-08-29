import { faker } from "@faker-js/faker";
import "@jest/globals";

beforeAll(() => {
  faker.seed(123);
});

afterAll(() => {
  faker.seed();
});
