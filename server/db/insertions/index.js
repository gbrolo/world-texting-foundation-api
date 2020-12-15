import uniqid from 'uniqid'
import { ErrorHandler } from '../../handlers/error'
import { SuccessResponseHandler } from '../../handlers/success'
import data from './data'
import { INSERT_BASE_ACRONYMS_ERROR } from './errors'
const { MONGO_DB_COLLECTION } = require("../consts")


const prepareData = () => {
  return data.acronyms.map(acronym => {
    const _id = uniqid()
    const acronymKey = Object.keys(acronym)[0]
    const acronymDefinition = acronym[acronymKey]

    return {
      _id,
      acronym: acronymKey,
      definition: acronymDefinition
    }
  })
}

const insertBaseAcronyms = (db) => {
  return new Promise((resolve, reject) => {
    const acronymList = prepareData()
    db.collection(MONGO_DB_COLLECTION).insertMany(
      acronymList,
      (error, result) => {
        if (error) {
          reject(
            new ErrorHandler(
              500,
              INSERT_BASE_ACRONYMS_ERROR.errorId,
              INSERT_BASE_ACRONYMS_ERROR.errorMessage,
              'insertBaseAcronyms(...)',
              error              
            )
          )
        }

        resolve(
          new SuccessResponseHandler(
            200,
            `Successfully initialized collection ${MONGO_DB_COLLECTION} with base data`,
            result
          )
        )
      }
    )
  })
}

export {
  insertBaseAcronyms
}