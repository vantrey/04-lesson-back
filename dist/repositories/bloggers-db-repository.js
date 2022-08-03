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
exports.bloggersRepository = void 0;
const db_1 = require("./db");
const posts_db_repository_1 = require("./posts-db-repository");
exports.bloggersRepository = {
    findBloggers(pageNumber, pageSize, SearchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (SearchNameTerm) {
                filter = { name: { $regex: SearchNameTerm } };
            }
            return db_1.bloggers.find(filter, { projection: { _id: 0 } }).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        });
    },
    getAllBloggersCount(SearchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (SearchNameTerm) {
                filter = { name: { $regex: SearchNameTerm } };
            }
            return db_1.bloggers.countDocuments(filter);
        });
    },
    createBlogger(newBlogger) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield db_1.bloggers.insertOne(newBlogger, { forceServerObjectId: true });
            if (created) {
                return newBlogger;
            }
            else {
                return null;
            }
        });
    },
    findBloggerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.bloggers.findOne({ id }, { projection: { _id: 0 } });
        });
    },
    updateBlogger(id, name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const myBlogger = yield db_1.bloggers.findOneAndUpdate({ id }, { $set: { name, youtubeUrl: url } }, { upsert: true });
            const posts = yield posts_db_repository_1.postRepository.getAllPostsByBloggerId(id);
            if (posts.length) {
                yield posts_db_repository_1.postRepository.updatePosts(id, name);
            }
            return !!myBlogger;
        });
    },
    deleteBlogger(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield posts_db_repository_1.postRepository.deletePosts(id);
            const deleted = yield db_1.bloggers.deleteOne({ id });
            return deleted.deletedCount > 0;
        });
    }
};
//# sourceMappingURL=bloggers-db-repository.js.map