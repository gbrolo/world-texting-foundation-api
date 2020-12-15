import { ErrorHandler } from '../../handlers/error'
import {
  ACRONYM_ERROR,
  NOT_FOUND_ACRONYM_ERROR,
  DUPLICATE_ACRONYM_ERROR,
  SEARCH_NOT_FOUND_ACRONYM_ERROR
} from './errors'
import { StatusCodes } from 'http-status-codes'
import { SuccessResponseHandler } from '../../handlers/success'

const addAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {
    const newAcronym = {...acronym, _id: acronym.acronym}

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
            undefined
          )
        )
      }
    )
  })
}

const getAcronym = (db, collection, acronym) => {
  return new Promise((resolve, reject) => {    
    db.collection(collection).find({ 'acronym': acronym }).toArray((error, result) => {
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
            `Successfully got matching acronym`,
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
      query = query.find({ 'acronym': new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') })
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
                `Successfully got acronyms`,
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

export {
  getAcronym,
  addAcronym,
  getAcronyms
}