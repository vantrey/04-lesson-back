"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const users_service_1 = require("./users-service");
const jwt_utility_1 = require("../application/jwt-utility");
exports.authService = {
    checkCredentials(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.usersService.findByCredentials(login, password);
            if (!user) {
                return null;
            }
            const token = jwt_utility_1.jwtUtility.createJWT(user);
            return token;
        });
    }
};
//# sourceMappingURL=auth-service.js.map