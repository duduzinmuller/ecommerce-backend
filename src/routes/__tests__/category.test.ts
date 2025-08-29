import { describe, it, expect } from "@jest/globals";
import { categoryRouter } from "../category";

describe("Category Routes", () => {
  it("should have POST /create route", () => {
    const routes = categoryRouter.stack;
    const createRoute = routes.find(
      (route: any) =>
        route.route?.path === "/create" && route.route?.methods?.post,
    );
    expect(createRoute).toBeDefined();
  });

  it("should have GET / route", () => {
    const routes = categoryRouter.stack;
    const getRoute = routes.find(
      (route: any) => route.route?.path === "/" && route.route?.methods?.get,
    );
    expect(getRoute).toBeDefined();
  });

  it("should have GET /:id route", () => {
    const routes = categoryRouter.stack;
    const idRoute = routes.find(
      (route: any) => route.route?.path === "/:id" && route.route?.methods?.get,
    );
    expect(idRoute).toBeDefined();
  });

  it("should have DELETE /:slug route", () => {
    const routes = categoryRouter.stack;
    const deleteRoute = routes.find(
      (route: any) =>
        route.route?.path === "/:slug" && route.route?.methods?.delete,
    );
    expect(deleteRoute).toBeDefined();
  });

  it("should have GET /slug/:slug route", () => {
    const routes = categoryRouter.stack;
    const slugRoute = routes.find(
      (route: any) =>
        route.route?.path === "/slug/:slug" && route.route?.methods?.get,
    );
    expect(slugRoute).toBeDefined();
  });
});
