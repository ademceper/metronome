// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type CreateInitialAccessTokenParams = { realm: string };
export const CreateInitialAccessTokenRoute = {
  path: "/:realm/clients/initialAccessToken/create",
  handle: {
    access: "manage-clients",
  },
};

export const toCreateInitialAccessToken = (
  params: CreateInitialAccessTokenParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CreateInitialAccessTokenRoute.path, params),
});
