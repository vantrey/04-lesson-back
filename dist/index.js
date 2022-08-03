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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const bloggers_router_1 = require("./routes/bloggers-router");
const posts_router_1 = require("./routes/posts-router");
const db_1 = require("./repositories/db");
const auth_router_1 = require("./routes/auth-router");
const users_router_1 = require("./routes/users-router");
const comments_router_1 = require("./routes/comments-router");
//create express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const port = process.env.PORT || 5005;
app.get('/', (req, res) => {
    res.send('Hello, World!!!! 4 HW');
});
app.use('/auth', auth_router_1.authRouter);
app.use('/bloggers', bloggers_router_1.bloggersRouter);
app.use('/posts', posts_router_1.postsRouter);
app.use('/users', users_router_1.usersRouter);
app.use('/comments', comments_router_1.commentsRouter);
//start app
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`);
    });
});
startApp();
//# sourceMappingURL=index.js.map