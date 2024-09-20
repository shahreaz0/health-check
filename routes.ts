import { checkController } from "./controllers/check.controller"
import { tokenController } from "./controllers/token.controller"
import { userController } from "./controllers/user.controller"

export const routes = {
  "/users": userController,
  "/token": tokenController,
  "/checks": checkController,
}
