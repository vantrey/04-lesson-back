import {MongoClient} from 'mongodb'
import {PostType} from './posts-repository'
import {BloggerType} from './bloggers-repository'
import {UserType} from './users-db-repository'
import {CommentType} from './comments-db-repository'
import {settings} from '../settings';

// const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const mongoUri = settings.MONGO_URI;
export const client = new MongoClient(mongoUri);
const connection = client.db('lessons');

export const posts = connection.collection<PostType>('posts')
export const bloggers = connection.collection<BloggerType>('bloggers')
export const users = connection.collection<UserType>('users')
export const comments = connection.collection<CommentType>('comments')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("products").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
