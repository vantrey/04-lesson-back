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
let bloggers = [
    { id: '1', name: 'blogger1', youtubeUrl: 'youtube1.com' },
    { id: '2', name: 'blogger2', youtubeUrl: 'youtube2.com' },
    { id: '3', name: 'blogger3', youtubeUrl: 'youtube3.com' }
];
exports.bloggersRepository = {
    findBloggers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (searchTerm) {
                return bloggers.filter(b => b.name.indexOf(searchTerm) > -1);
            }
            else {
                return bloggers;
            }
        });
    },
    createBlogger(name, url) {
        const bloggerLength = bloggers.length;
        const newBlogger = {
            id: new Date().getTime().toString(),
            name: name,
            youtubeUrl: url,
        };
        bloggers.push(newBlogger);
        if (bloggerLength < bloggers.length) {
            return newBlogger;
        }
        else {
            return null;
        }
    },
    findBloggerById(id) {
        const blogger = bloggers.find(b => b.id === id);
        if (blogger) {
            return blogger;
        }
        else {
            return null;
        }
    },
    updateBlogger(id, name, url) {
        const blogger = bloggers.find(b => b.id === id);
        if (blogger) {
            bloggers = bloggers.map(b => {
                if (b.id === id) {
                    return Object.assign(Object.assign({}, b), { name: name, youtubeUrl: url });
                }
                else
                    return b;
            });
            return true;
        }
        else
            return false;
    },
    deleteBlogger(id) {
        if (id) {
            let newBloggers = bloggers.filter(b => b.id !== id);
            if (newBloggers.length < bloggers.length) {
                bloggers = newBloggers;
                return true;
            }
        }
        else
            return false;
    }
};
//# sourceMappingURL=bloggers-repository.js.map