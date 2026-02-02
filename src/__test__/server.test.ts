import request from 'supertest'
import server from '../server'

describe('API Products', () => {
  it('GET /api/products', async () => {
    const res = await request(server).get('/api/products')
    expect(res.status).toBe(200)
  })
})
