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
exports.postService = void 0;
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const bloggers_db_repository_1 = require("../repositories/bloggers-db-repository");
const likeTypes_1 = require("../types/likeTypes");
const likes_service_1 = require("./likes-service");
const mongodb_1 = require("mongodb");
exports.postService = {
    getPosts(pageNumber, pageSize, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPosts = yield posts_db_repository_1.postRepository.getPosts(pageNumber, pageSize);
            const allPostsCount = yield posts_db_repository_1.postRepository.getAllPostsCount();
            const postsIds = foundPosts.map((post) => new mongodb_1.ObjectId(post.id));
            const likesByPosts = yield likes_service_1.likesService.getLikesDislikesByParents(postsIds);
            console.log('likesByPosts = ', likesByPosts);
            const postsWithLikes = foundPosts.map((post) => {
                var _a, _b;
                const accordingLikes = likesByPosts.filter((like) => (like.status === likeTypes_1.LikeStatus.Like) && (like.parentId.toString() === post.id)).reverse();
                const accordingDislikes = likesByPosts.filter((like) => (like.status === likeTypes_1.LikeStatus.Dislike) && (like.parentId.toString() === post.id));
                const newestLikes = accordingLikes.slice(0, 3).map((like) => ({
                    addedAt: like.addedAt,
                    userId: like.userId.toString(),
                    login: like.login,
                }));
                let myStatus = likeTypes_1.LikeStatus.None;
                if (userId) {
                    const myStatusLike = (_a = accordingLikes.find((like) => like.userId.toString() === userId.toString())) === null || _a === void 0 ? void 0 : _a.status;
                    const myStatusDislike = (_b = accordingDislikes.find((like) => like.userId.toString() === userId.toString())) === null || _b === void 0 ? void 0 : _b.status;
                    myStatus = myStatusLike || myStatusDislike || likeTypes_1.LikeStatus.None;
                }
                return Object.assign(Object.assign({}, post), { extendedLikesInfo: {
                        likesCount: accordingLikes.length,
                        dislikesCount: accordingDislikes.length,
                        myStatus,
                        newestLikes
                    } });
            });
            console.log('postsWithLikes', postsWithLikes);
            return {
                pagesCount: Math.ceil(allPostsCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: allPostsCount,
                items: postsWithLikes
            };
        });
    },
    getPostsByBloggerId(pageNumber, pageSize, bloggerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPostsByBloggerId = yield posts_db_repository_1.postRepository.getAllPostsByBloggerId(bloggerId);
            const foundPosts = yield posts_db_repository_1.postRepository.getPostsByBloggerId(pageNumber, pageSize, bloggerId);
            const postsIds = foundPosts.map((post) => new mongodb_1.ObjectId(post.id));
            const likesByPosts = yield likes_service_1.likesService.getLikesDislikesByParents(postsIds);
            console.log('likesByPosts = ', likesByPosts);
            const postsWithLikes = foundPosts.map((post) => {
                var _a, _b;
                const accordingLikes = likesByPosts.filter((like) => (like.status === likeTypes_1.LikeStatus.Like) && (like.parentId.toString() === post.id)).reverse();
                const accordingDislikes = likesByPosts.filter((like) => (like.status === likeTypes_1.LikeStatus.Dislike) && (like.parentId.toString() === post.id));
                const newestLikes = accordingLikes.slice(0, 3).map((like) => ({
                    addedAt: like.addedAt,
                    userId: like.userId.toString(),
                    login: like.login,
                }));
                let myStatus = likeTypes_1.LikeStatus.None;
                if (userId) {
                    const myStatusLike = (_a = accordingLikes.find((like) => like.userId.toString() === userId.toString())) === null || _a === void 0 ? void 0 : _a.status;
                    const myStatusDislike = (_b = accordingDislikes.find((like) => like.userId.toString() === userId.toString())) === null || _b === void 0 ? void 0 : _b.status;
                    myStatus = myStatusLike || myStatusDislike || likeTypes_1.LikeStatus.None;
                }
                return Object.assign(Object.assign({}, post), { extendedLikesInfo: {
                        likesCount: accordingLikes.length,
                        dislikesCount: accordingDislikes.length,
                        myStatus,
                        newestLikes
                    } });
            });
            console.log('postsWithLikes', postsWithLikes);
            return {
                pagesCount: Math.ceil(allPostsByBloggerId.length / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: allPostsByBloggerId.length,
                items: postsWithLikes
            };
        });
    },
    getAllPostsByBloggerId(bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postRepository.getAllPostsByBloggerId(bloggerId);
        });
    },
    createPost(title, descr, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogger = yield bloggers_db_repository_1.bloggersRepository.findBloggerById(bloggerId);
            const newPost = {
                id: new mongodb_1.ObjectId().toString(),
                addedAt: new Date(),
                title,
                shortDescription: descr,
                content,
                bloggerId,
                bloggerName: blogger === null || blogger === void 0 ? void 0 : blogger.name
            };
            const createdPost = yield posts_db_repository_1.postRepository.createPost(newPost);
            if (createdPost) {
                return Object.assign(Object.assign({}, createdPost), { extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: likeTypes_1.LikeStatus.None,
                        newestLikes: [],
                    } });
            }
            return null;
        });
    },
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_db_repository_1.postRepository.getPostById(postId);
            if (!post) {
                return null;
            }
            const likesCount = yield likes_service_1.likesService.getLikesCountByParent(new mongodb_1.ObjectId(postId));
            const dislikesCount = yield likes_service_1.likesService.getDislikesCountByParent(new mongodb_1.ObjectId(postId));
            const newestRepositoryLikes = yield likes_service_1.likesService.getNewestLikesByParent(new mongodb_1.ObjectId(postId));
            console.log(likesCount, dislikesCount);
            const newestLikes = newestRepositoryLikes.map((like) => ({
                userId: like.userId.toString(),
                addedAt: like.addedAt,
                login: like.login
            }));
            let myStatus = likeTypes_1.LikeStatus.None;
            if (userId) {
                const userLike = yield likes_service_1.likesService.getLikeByParentAndUser(new mongodb_1.ObjectId(postId), new mongodb_1.ObjectId(userId));
                myStatus = (userLike === null || userLike === void 0 ? void 0 : userLike.status) || likeTypes_1.LikeStatus.None;
            }
            return Object.assign(Object.assign({}, post), { extendedLikesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus,
                    newestLikes
                } });
        });
    },
    updateLikeStatus(postId, user, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                return false;
            }
            switch (status) {
                case likeTypes_1.LikeStatus.Like:
                    return yield likes_service_1.likesService.createLike(new mongodb_1.ObjectId(postId), user._id, user.login);
                case likeTypes_1.LikeStatus.Dislike:
                    return likes_service_1.likesService.createDislike(new mongodb_1.ObjectId(postId), user._id, user.login);
                case likeTypes_1.LikeStatus.None:
                    return likes_service_1.likesService.removeLikeDislike(new mongodb_1.ObjectId(postId), user._id);
                default:
                    return false;
            }
        });
    },
    updatePost(id, title, descr, content, bloggerId, bloggerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_db_repository_1.postRepository.getPostById(id);
            if (!post) {
                return false;
            }
            return yield posts_db_repository_1.postRepository.updatePost(id, title, descr, content, bloggerId, bloggerName);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield posts_db_repository_1.postRepository.deletePost(id);
            // console.log(res.value) //null or object
            // console.log(res.ok) // always 1
            return res.value !== null;
        });
    }
};
//# sourceMappingURL=posts-service.js.map