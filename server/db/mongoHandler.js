const { MONGO_DB_DATABASE } = require("./consts")

const openConnection = (client) => {
  return new Promise((resolve, reject) => {
    client.connect((error) => {
      if (error) {
        console.log('[Mongo setup] MongoDB Service could not be initialized.')
        console.log(error)
        reject(error)
      }

      const db = client.db(MONGO_DB_DATABASE)
      console.log('[Mongo setup] Initiated MongoDB service.')
      resolve(db)
    })
  })
}

export {
  openConnection
}