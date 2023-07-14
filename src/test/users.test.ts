import {
  afterAll,
  beforeAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:latest')
  })

  afterEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
  })

  describe('Create User', () => {
    it('should be able to create a new user', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user1',
          email: 'user1@vitest.com',
        })
        .expect(201)

      console.log(createUsersResponse.body)

      expect(createUsersResponse.body).toEqual([
        expect.objectContaining({
          name: 'user1',
          email: 'user1@vitest.com',
        }),
      ])
    })
  })

  describe('Get User Info', () => {
    it('should be able to get a user by id', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user2',
          email: 'user2@vitest.com',
        })
        .expect(201)

      const { id } = createUsersResponse.body[0]
      const cookie = createUsersResponse.get('Set-Cookie')

      const getUsersResponse = await request(app.server)
        .get(`/api/users/${id}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(getUsersResponse.body)

      expect(getUsersResponse.body.users).toEqual(
        expect.objectContaining({
          name: 'user2',
          email: 'user2@vitest.com',
        }),
      )
    })
    it('should be able to get a metrics for a user existing by id', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user4',
          email: 'user4@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      await request(app.server)
        .post('/api/snacks')
        .send({
          name: 'Café da manhã',
          description: 'banana, ovos, bacon e igourte',
          isDiet: true,
          date: '2023/07/15',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(201)

      await request(app.server)
        .post('/api/snacks')
        .send({
          name: 'Café da manhã',
          description: 'banana, ovos, bacon e igourte',
          isDiet: true,
          date: '2023/07/16',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(201)

      await request(app.server)
        .post('/api/snacks')
        .send({
          name: 'Café da manhã',
          description: 'banana, ovos, bacon e igourte',
          isDiet: false,
          date: '2023/07/15',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(201)

      const [user] = createUsersResponse.body

      const { id: idUser } = user

      const getMetricsUserResponse = await request(app.server)
        .get(`/api/users/metrics/${idUser}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(getMetricsUserResponse.body)

      expect(getMetricsUserResponse.body.metrics).toEqual(
        expect.objectContaining({
          bestSequencyInDiet: 2,
          snacksInDiet: 2,
          snacksOutDiet: 1,
          totalSnacks: 3,
        }),
      )
    })
  })
})
