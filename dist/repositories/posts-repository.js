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
const bloggers_repository_1 = require("./bloggers-repository");
let posts = [];
exports.postRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const newPosts = posts.map(p => {
                var _a;
                let bloggerName = (_a = bloggers_repository_1.bloggersRepository.findBloggerById(p.bloggerId)) === null || _a === void 0 ? void 0 : _a.name;
                return Object.assign(Object.assign({}, p), { bloggerName });
            });
            return newPosts;
        });
    },
    createPost(title, descr, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsLength = posts.length;
            const newPost = {
                id: new Date().getTime().toString(),
                title,
                shortDescription: descr,
                content,
                bloggerId,
                addedAt: new Date()
            };
            posts.push(newPost);
            if (postsLength < posts.length) {
                const blogger = yield bloggers_repository_1.bloggersRepository.findBloggerById(newPost.bloggerId);
                return Object.assign(Object.assign({}, newPost), { bloggerName: blogger === null || blogger === void 0 ? void 0 : blogger.name });
            }
            else
                return null;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = posts.find(p => p.id === id);
            if (post) {
                const blogger = yield bloggers_repository_1.bloggersRepository.findBloggerById(post.bloggerId);
                if (blogger) {
                    return Object.assign(Object.assign({}, post), { bloggerName: blogger === null || blogger === void 0 ? void 0 : blogger.name });
                }
                else
                    return null;
            }
            else
                return null;
        });
    },
    updatePost(id, title, descr, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = posts.find(p => p.id === id);
            if (post) {
                posts = posts.map(p => {
                    if (p.id === id) {
                        return Object.assign(Object.assign({}, p), { title, bloggerId, content, shortDescription: descr });
                    }
                    else
                        return p;
                });
                return true;
            }
            else
                return false;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPosts = posts.filter(p => p.id !== id);
            if (newPosts.length < posts.length) {
                posts = newPosts;
                return true;
            }
            else {
                return false;
            }
        });
    }
};
//# sourceMappingURL=posts-repository.js.map