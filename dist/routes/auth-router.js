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
exports.authRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const auth_service_1 = require("../bll-domain/auth-service");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', input_validation_middleware_1.loginValidation, input_validation_middleware_1.passwordValidation, input_validation_middleware_1.authValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const login = req.body.login;
    const password = req.body.password;
    const result = yield auth_service_1.authService.checkCredentials(login, password);
    if (!result) {
        res.sendStatus(401);
        return;
    }
    res.cookie('refreshToken', result, {
        maxAge: 100000,
        httpOnly: true,
        secure: true,
    });
    res.status(200).send({ accessToken: result });
}));
//# sourceMappingURL=auth-router.js.map