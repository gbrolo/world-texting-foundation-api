import assert from 'assert'
import { MISSING_PARAMETER_ERROR } from '../errors'
import { verifyPresentParams } from '../requestHandlers'

describe("Test if required params are present", () => {
  it("should check if request params contains param list", async () => {
    const actual = await verifyPresentParams(['acronym'], { acronym: '1UP' })
    const expect = undefined
    assert.deepStrictEqual(actual, expect)
  })
})

describe("Test if required params are not present", () => {
  it("should check that required params are not present in request and throw error", async () => {
    const actual = await verifyPresentParams(['acronym'], {}).catch(error => {      
      assert.strictEqual(error.errorId, MISSING_PARAMETER_ERROR.errorId)
      assert.strictEqual(error.errorMessage, MISSING_PARAMETER_ERROR.errorMessage)
    })    
  })
})