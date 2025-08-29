import { describe, it, expect } from "@jest/globals";
import { userRouter } from "../user";

describe("User Routes", () => {
  it("should have POST /create route", () => {
    const routes = userRouter.stack;
    const createRoute = routes.find(
      (route: any) =>
        route.route?.path === "/create" && route.route?.methods?.post,
    );
    expect(createRoute).toBeDefined();
  });

  it("should have POST /login route", () => {
    const routes = userRouter.stack;
    const loginRoute = routes.find(
      (route: any) =>
        route.route?.path === "/login" && route.route?.methods?.post,
    );
    expect(loginRoute).toBeDefined();
  });

  it("should have GET /me route", () => {
    const routes = userRouter.stack;
    const meRoute = routes.find(
      (route: any) => route.route?.path === "/me" && route.route?.methods?.get,
    );
    expect(meRoute).toBeDefined();
  });

  it("should have DELETE /me route", () => {
    const routes = userRouter.stack;
    const deleteRoute = routes.find(
      (route: any) =>
        route.route?.path === "/me" && route.route?.methods?.delete,
    );
    expect(deleteRoute).toBeDefined();
  });
});
