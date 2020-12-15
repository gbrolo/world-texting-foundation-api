import { expect } from 'chai'
import { verifyPresentParams } from '../paramChecker'

describe("Test paramChecker", () => {
  it("should check if request params contains param list", () => {
    const reversed = verifyPresentParams(['acronym'], { acronym: '1UP' })
    expect(reversed).to.eql(true)
  })
})