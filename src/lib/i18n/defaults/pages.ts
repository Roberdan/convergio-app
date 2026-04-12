import type {
  ErrorPageLabels, NotFoundLabels, LoginPageLabels,
  DialogLabels, SheetLabels,
} from "../types";

export const errorPageDefaults: ErrorPageLabels = {
  somethingWentWrong: "Something went wrong",
  unexpectedError: "An unexpected error occurred. Please try again or contact support if the problem persists.",
  sectionError: "An unexpected error occurred in this section.",
  tryAgain: "Try again",
  goToDashboard: "Go to dashboard",
};

export const notFoundDefaults: NotFoundLabels = {
  pageNotFound: "Page not found",
  pageNotFoundDescription: "The page you are looking for does not exist.",
  backToDashboard: "Back to Dashboard",
};

export const loginPageDefaults: LoginPageLabels = {
  signIn: "Sign in",
  enterCredentials: "Enter your credentials to continue.",
  username: "Username",
  usernamePlaceholder: "admin",
  password: "Password",
  passwordPlaceholder: "Your password",
  signInButton: "Sign In",
  noAccount: "No account yet? Contact your administrator.",
};

export const dialogDefaults: DialogLabels = {
  close: "Close",
};

export const sheetDefaults: SheetLabels = {
  close: "Close",
};
