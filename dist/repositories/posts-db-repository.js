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
exports.postRepository = void 0;
const db_1 = require("./db");
exports.postRepository = {
    getPosts(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.posts.find({}, { projection: { _id: 0 } }).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        });
    },
    getAllPostsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.posts.countDocuments();
        });
    },
    getPostsByBloggerId(pageNumber, pageSize, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.posts.find({ bloggerId }, { projection: { _id: 0 } }).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        });
    },
    getAllPostsByBloggerId(bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.posts.find({ bloggerId }, { projection: { _id: 0 } }).toArray();
        });
    },
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield db_1.posts.insertOne(newPost, { forceServerObjectId: true });
            if (created) {
                return newPost;
            }
            else
                return null;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.posts.findOne({ id }, { projection: { _id: 0 } });
            if (post) {
                return post;
            }
            else
                return null;
        });
    },
    updatePost(id, title, descr, content, bloggerId, bloggerName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.posts.findOneAndUpdate({ id }, { $set: { title, shortDescription: descr, content, bloggerId, bloggerName } }, { upsert: true });
            return true;
        });
    },
    updatePosts(bloggerId, bloggerName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.posts.updateMany({ bloggerId }, { $set: { bloggerName } }, { upsert: true });
            return true;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.posts.findOneAndDelete({ id });
        });
    },
    deletePosts(bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.posts.deleteMany({ bloggerId });
        });
    }
};
//# sourceMappingURL=posts-db-repository.js.map