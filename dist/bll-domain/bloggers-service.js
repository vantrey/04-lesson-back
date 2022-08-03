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
exports.bloggersService = void 0;
const bloggers_db_repository_1 = require("../repositories/bloggers-db-repository");
exports.bloggersService = {
    findBloggers(pageNumber, pageSize, SearchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBloggers = yield bloggers_db_repository_1.bloggersRepository.findBloggers(pageNumber, pageSize, SearchNameTerm);
            const allBloggersCount = yield bloggers_db_repository_1.bloggersRepository.getAllBloggersCount(SearchNameTerm);
            return {
                pagesCount: Math.ceil(allBloggersCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: allBloggersCount,
                items: foundBloggers
            };
        });
    },
    createBlogger(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlogger = {
                id: new Date().getTime().toString(),
                name: name,
                youtubeUrl: url,
            };
            return bloggers_db_repository_1.bloggersRepository.createBlogger(newBlogger);
        });
    },
    findBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return bloggers_db_repository_1.bloggersRepository.findBloggerById(id);
        });
    },
    updateBlogger(id, name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlogger = yield bloggers_db_repository_1.bloggersRepository.findBloggerById(id);
            if (!isBlogger) {
                return false;
            }
            return bloggers_db_repository_1.bloggersRepository.updateBlogger(id, name, url);
        });
    },
    deleteBlogger(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return bloggers_db_repository_1.bloggersRepository.deleteBlogger(id);
        });
    }
};
//# sourceMappingURL=bloggers-service.js.map