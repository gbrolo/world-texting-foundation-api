/**
 * Creates a text index on a set of fields for an entire collection
 * @param {string} db MongoDB database name
 * @param {string} collection Collection name
 * @param {Array} fields field on which to build index on
 */
const createTextIndex = (db, collection, fields) => {
  console.log(`[Mongo setup] Creating text index for ${collection}, ${fields}`)

  const mongoObject = {}
  fields.forEach(field => {
    mongoObject[field] = "text"  
  });
  db.collection(collection).createIndex(
    mongoObject, (error, result) => {
      if (error) {
        console.log(`[Mongo setup] Error while creating text index for ${collection}, ${fields}: ${error}`)
      } else {
        console.log(`[Mongo setup] Success while creating text index for ${collection}, ${fields}: ${result}`)                
      }
    }
  )
}

export {
  createTextIndex
}