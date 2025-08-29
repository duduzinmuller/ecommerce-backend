import { describe, it, expect } from "@jest/globals";
import { productRouter } from "../product";

describe("Product Routes", () => {
  it("should have POST /create route", () => {
    const routes = productRouter.stack;
    const createRoute = routes.find(
      (route: any) =>
        route.route?.path === "/create" && route.route?.methods?.post,
    );
    expect(createRoute).toBeDefined();
  });

  it("should have GET / route", () => {
    const routes = productRouter.stack;
    const getRoute = routes.find(
      (route: any) => route.route?.path === "/" && route.route?.methods?.get,
    );
    expect(getRoute).toBeDefined();
  });

  it("should have PUT /:slug route", () => {
    const routes = productRouter.stack;
    const updateRoute = routes.find(
      (route: any) =>
        route.route?.path === "/:slug" && route.route?.methods?.put,
    );
    expect(updateRoute).toBeDefined();
  });

  it("should have DELETE /:slug route", () => {
    const routes = productRouter.stack;
    const deleteRoute = routes.find(
      (route: any) =>
        route.route?.path === "/:slug" && route.route?.methods?.delete,
    );
    expect(deleteRoute).toBeDefined();
  });

  it("should have GET /name/:name route", () => {
    const routes = productRouter.stack;
    const nameRoute = routes.find(
      (route: any) =>
        route.route?.path === "/name/:name" && route.route?.methods?.get,
    );
    expect(nameRoute).toBeDefined();
  });

  it("should have GET /:slug route", () => {
    const routes = productRouter.stack;
    const slugRoute = routes.find(
      (route: any) =>
        route.route?.path === "/:slug" && route.route?.methods?.get,
    );
    expect(slugRoute).toBeDefined();
  });
});
