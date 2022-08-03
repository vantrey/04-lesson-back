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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_db_repository_1 = require("../repositories/users-db-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
exports.usersService = {
    getUsers(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_db_repository_1.usersRepository.getUsers(pageNumber, pageSize);
            const usersCount = yield users_db_repository_1.usersRepository.getUsersCount();
            return {
                pagesCount: Math.ceil(usersCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: usersCount,
                items: users
            };
        });
    },
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.generateHash(password);
            const user = Object.assign({ _id: new mongodb_1.ObjectId(), id: new Date().getTime().toString(), login,
                passwordHash }, (email && { email }));
            return users_db_repository_1.usersRepository.createUser(user);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_db_repository_1.usersRepository.deleteUser(id);
        });
    },
    getUserBy_id(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_db_repository_1.usersRepository.getUserBy_Id(_id);
        });
    },
    findByCredentials(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByLogin(login);
            if (!user)
                return null;
            const isHashesEquals = yield this.isPasswordCorrect(password, user.passwordHash);
            if (isHashesEquals) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.getUserById(id);
        });
    },
    generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, 10);
            return hash;
        });
    },
    isPasswordCorrect(password, hash2) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEqual = yield bcrypt_1.default.compare(password, hash2);
            return isEqual;
        });
    },
};
//# sourceMappingURL=users-service.js.map