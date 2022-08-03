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
exports.usersRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_service_1 = require("../bll-domain/users-service");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, input_validation_middleware_1.getQueryPaginationFromQueryString)(req);
    const users = yield users_service_1.usersService.getUsers(params.pageNumber, params.pageSize);
    res.status(200).send(users);
}));
exports.usersRouter.post('/', input_validation_middleware_1.basicAuth, input_validation_middleware_1.loginValidation, input_validation_middleware_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    const foundUser = yield users_service_1.usersService.findByCredentials(login, password);
    if (foundUser) {
        res.sendStatus(400);
        return;
    }
    const user = yield users_service_1.usersService.createUser(login, password, email);
    res.status(201).send(user);
}));
exports.usersRouter.delete('/:id', input_validation_middleware_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    if (!id) {
        res.send(400);
        return;
    }
    const user = yield users_service_1.usersService.getUserById(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    const isDeleted = yield users_service_1.usersService.deleteUser(id.toString().trim());
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(400); //!!!!!!!!!!!!!!
}));
//# sourceMappingURL=users-router.js.map