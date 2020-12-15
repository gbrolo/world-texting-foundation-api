import { expect } from 'chai'
import request from 'supertest'
import app from '../../app'

describe("GET /random", () => {
  it ("returns random acronym count", async () => {
    const response = await request(app).get('/random/0')

    expect(response.status).to.eql(200)
    expect(response.body).to.eql({"random":[]})
  })
})