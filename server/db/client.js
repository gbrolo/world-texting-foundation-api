import mongodb from 'mongodb'
import { MONGO_DB_CONNECTION_URL } from './consts'

const MongoClient = mongodb.MongoClient
const client = new MongoClient(MONGO_DB_CONNECTION_URL, { useUnifiedTopology: true })

export default client
