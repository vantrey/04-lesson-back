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
exports.usersRepository = void 0;
const db_1 = require("./db");
exports.usersRepository = {
    getUsers(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.users.find({}, { projection: { _id: 0, passwordHash: 0 } }).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        });
    },
    getUsersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.users.countDocuments();
        });
    },
    findUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.users.findOne({ login });
        });
    },
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.users.insertOne(user);
            return {
                id: user._id.toString(),
                login: user.login,
            };
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.users.findOneAndDelete({ id });
            return res.value !== null;
        });
    },
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = userId.toString().trim();
            return yield db_1.users.findOne({ id });
        });
    },
    getUserBy_Id(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.users.findOne({ _id });
        });
    },
};
//# sourceMappingURL=users-db-repository.js.map