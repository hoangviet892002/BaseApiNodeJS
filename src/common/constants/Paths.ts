export default {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login",
    Register: "/register",
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Tests: {
    Base: "/tests",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
} as const;
