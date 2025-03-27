import "supertokens-auth-react";

declare module "supertokens-auth-react/recipe/thirdpartyemailpassword" {
  interface Config {
    signInAndUpFeature?: {
      providers: [];
    };
  }
}
