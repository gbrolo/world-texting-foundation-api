import { ErrorHandler } from '../../handlers/error'
import { SuccessResponseHandler } from '../../handlers/success'
import data from './data'
import { StatusCodes } from 'http-status-codes'
import { INSERT_BASE_ACRONYMS_ERROR } from './errors'
const { MONGO_DB_COLLECTION } = require('../consts')

const prepareData = () => {
  // remove duplicates (if any)
  const acronyms = data.acronyms.reduce((newKeys, acronym) => {
    const key = Object.keys(acronym)[0]
    if (!newKeys.includes(key)) {
      newKeys.push(key)
    }
    return newKeys
  }, []).map(acronymKey => {
    return data.acronyms.filter(acronym => Object.keys(acronym)[0] === acronymKey)[0]
  })

  return acronyms.map(acronym => {
    const acronymKey = Object.keys(acronym)[0]
    const _id = acronymKey
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
              StatusCodes.OK,
              INSERT_BASE_ACRONYMS_ERROR.errorId,
              INSERT_BASE_ACRONYMS_ERROR.errorMessage,
              'insertBaseAcronyms(...)',
              error
            )
          )
        }

        resolve(
          new SuccessResponseHandler(
            StatusCodes.OK,
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
