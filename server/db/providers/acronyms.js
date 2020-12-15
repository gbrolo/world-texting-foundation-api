import { ErrorHandler } from '../../handlers/error'
import {
  ACRONYM_ERROR,
  NOT_FOUND_ACRONYM_ERROR,
  DUPLICATE_ACRONYM_ERROR,
  RANDOM_COUNT_TOO_BIG_ERROR,
  SEARCH_NOT_FOUND_ACRONYM_ERROR
} from './errors'
import { StatusCodes } from 'http-status-codes'
import { SuccessResponseHandler } from '../../handlers/success'

import _ from 'lodash'

const addAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {
    const newAcronym = { ...acronym, _id: acronym.acronym }

    db.collection(collection).insertOne(
      newAcronym,
      (error, result) => {
        if (error) {
          if (error.code === 11000) {
            reject(
              new ErrorHandler(
                StatusCodes.CONFLICT,
                DUPLICATE_ACRONYM_ERROR.errorId,
                DUPLICATE_ACRONYM_ERROR.errorMessage,
                'addAcronym(...)',
                error
              )
            )
          } else {
            reject(
              new ErrorHandler(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ACRONYM_ERROR.errorId,
                ACRONYM_ERROR.errorMessage,
                'addAcronym(...)',
                error
              )
            )
          }
        }

        resolve(
          new SuccessResponseHandler(
            StatusCodes.OK,
            `Successfully added acronym ${acronym.acronym}`,
            { created: true }
          )
        )
      }
    )
  })
}

const updateAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).updateOne(
      { _id: acronym.acronym },
      { $set: { definition: acronym.definition } },
      (error, result) => {
        if (error) {
          reject(
            new ErrorHandler(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ACRONYM_ERROR.errorId,
              ACRONYM_ERROR.errorMessage,
              'updateAcronym(...)',
              error
            )
          )
        }

        resolve(
          new SuccessResponseHandler(
            StatusCodes.OK,
            `Successfully updated acronym ${acronym.acronym}`,
            { updated: true }
          )
        )
      }
    )
  })
}

const deleteAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteOne(
      { _id: acronym },
      (error, result) => {
        if (error) {
          console.log(error)
          reject(
            new ErrorHandler(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ACRONYM_ERROR.errorId,
              ACRONYM_ERROR.errorMessage,
              'updateAcronym(...)',
              error
            )
          )
        }

        resolve(
          new SuccessResponseHandler(
            StatusCodes.OK,
            `Successfully deleted acronym ${acronym}`,
            { deleted: true }
          )
        )
      }
    )
  })
}

const getAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).find({ acronym: acronym }).toArray((error, result) => {
      if (error) {
        reject(
          new ErrorHandler(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ACRONYM_ERROR.errorId,
            ACRONYM_ERROR.errorMessage,
            'getAcronym(...)',
            error
          )
        )
      }

      if (result.length === 0) {
        reject(
          new ErrorHandler(
            StatusCodes.NOT_FOUND,
            NOT_FOUND_ACRONYM_ERROR.errorId,
            NOT_FOUND_ACRONYM_ERROR.errorMessage,
            'getAcronym(...)',
            error
          )
        )
      } else {
        resolve(
          new SuccessResponseHandler(
            StatusCodes.OK,
            'Successfully got matching acronym',
            result[0]
          )
        )
      }
    })
  })
}

const getAcronyms = (db, collection, options) => {
  return new Promise((resolve, reject) => {
    const { from, limit, search } = options
    let query = db.collection(collection)

    if (search) {
      // query = query.find({ '$text': { '$search': search } })
      query = query.find({ acronym: new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi') })
    } else {
      query = query.find()
    }

    query.count()
      .then((totalCount) => {
        if (from) {
          query = query.skip(parseInt(from))
        }

        if (limit) {
          query = query.limit(parseInt(limit))
        }

        query.toArray((error, result) => {
          if (error) {
            reject(
              new ErrorHandler(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ACRONYM_ERROR.errorId,
                ACRONYM_ERROR.errorMessage,
                'getAcronym(...)',
                error
              )
            )
          }

          if (result.length === 0) {
            reject(
              new ErrorHandler(
                StatusCodes.NOT_FOUND,
                SEARCH_NOT_FOUND_ACRONYM_ERROR.errorId,
                SEARCH_NOT_FOUND_ACRONYM_ERROR.errorMessage,
                'getAcronym(...)',
                SEARCH_NOT_FOUND_ACRONYM_ERROR.errorMessage
              )
            )
          } else {
            resolve(
              new SuccessResponseHandler(
                StatusCodes.OK,
                'Successfully got acronyms',
                result,
                [
                  {
                    header: 'total-count',
                    value: totalCount
                  },
                  {
                    header: 'X-Total-Count',
                    value: totalCount
                  }
                ]
              )
            )
          }
        })
      })
  })
}

const getRandomAcronyms = (db, collection, count) => {
  return new Promise((resolve, reject) => {
    getAcronyms(db, collection, {})
      .then(acronymsSucc => {
        const acronyms = acronymsSucc.getBodyResponse()
        const offLengthRejection = new ErrorHandler(
          StatusCodes.NOT_ACCEPTABLE,
          RANDOM_COUNT_TOO_BIG_ERROR.errorId,
          RANDOM_COUNT_TOO_BIG_ERROR.errorMessage,
          'getRandomAcronyms(...)',
          RANDOM_COUNT_TOO_BIG_ERROR.errorMessage
        )

        // count can't be bigger than actual acronyms collection size (since we can't repeat items to comply with non adjacent matching and duplicates)
        if (acronyms.length > count) {
          const seed = Math.floor(Math.random() * 2) + 1
          // get even or odd positioned acronyms to comply with non adjacent matching
          const choppedAcronyms = _.shuffle(seed === 1 ? acronyms.filter((acronym, index) => index % 2 === 0) : acronyms.filter((acronym, index) => index % 2 !== 0))

          // count can't still be bigger than choppedAcronyms since we have to select items inside this sub set
          if (choppedAcronyms.length > count) {
            const randomAcronyms = []
            const uniquePositions = []

            const generatedPositions = (arr) => {
              if (arr.length >= count) return
              const newNumber = Math.floor(Math.random() * count + 1)
              if (arr.indexOf(newNumber) < 0) {
                arr.push(newNumber)
                randomAcronyms.push(choppedAcronyms[newNumber])
              }
              generatedPositions(arr)
            }

            generatedPositions(uniquePositions)

            resolve(
              new SuccessResponseHandler(
                StatusCodes.OK,
                'Successfully got random acronyms',
                randomAcronyms
              )
            )
          } else {
            reject(offLengthRejection)
          }
        } else {
          reject(offLengthRejection)
        }
      })
      .catch(error => reject(error))
  })
}

export {
  getAcronym,
  addAcronym,
  getAcronyms,
  updateAcronym,
  deleteAcronym,
  getRandomAcronyms
}
