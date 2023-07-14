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

describe('Snacks Routes', () => {
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

  describe('Create Snack', async () => {
    it('should be able to create a snack', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user3',
          email: 'user3@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      const createSnackResponse = await request(app.server)
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

      console.log(createSnackResponse.body)

      expect(createSnackResponse.body.snack).toEqual([
        expect.objectContaining({
          name: 'Café da manhã',
          description: 'banana, ovos, bacon e igourte',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
      ])
    })

    it('should be able to incrementy sequency when create snack with if isDiet for equal true', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user4',
          email: 'user4@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      const createSnackResponse = await request(app.server)
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

      console.log(createSnackResponse.body)

      const [user] = createUsersResponse.body

      const { id: idUser } = user

      const getUsersResponse = await request(app.server)
        .get(`/api/users/${idUser}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(getUsersResponse.body.users)

      expect(getUsersResponse.body.users).toEqual(
        expect.objectContaining({
          inSequency: 1,
        }),
      )
    })

    it('should be able to restart sequency for 0 when create snack with isDiet for equal false', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user4',
          email: 'user4@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      // Snack 1
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

      // Snack 2
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

      // Snack 3
      const createSnackResponse = await request(app.server)
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

      console.log(createSnackResponse.body)

      const [user] = createUsersResponse.body

      const { id: idUser } = user

      const getUsersResponse = await request(app.server)
        .get(`/api/users/${idUser}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(getUsersResponse.body.users)

      expect(getUsersResponse.body.users).toEqual(
        expect.objectContaining({
          inSequency: 0,
        }),
      )
    })

    it('should be able to update bestSequency when create snack with if sequency for bigger', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user4',
          email: 'user4@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')
      // Snack 1
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

      // Snack 2
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

      const createSnackResponse = await request(app.server)
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

      console.log(createSnackResponse.body)

      const [user] = createUsersResponse.body

      const { id: idUser } = user

      const getUsersResponse = await request(app.server)
        .get(`/api/users/${idUser}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(getUsersResponse.body.users)

      expect(getUsersResponse.body.users).toEqual(
        expect.objectContaining({
          inSequency: 2,
        }),
      )
    })
  })

  describe('Update Snack', async () => {
    it('should be able to update a snack created for a user with idSession exists', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user5',
          email: 'user5@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      const createSnackResponse = await request(app.server)
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

      console.log(createSnackResponse.body)

      const updateSnackResponse = await request(app.server)
        .put('/api/snacks')
        .send({
          name: 'Almoço',
          description: 'arroz, feijão, salada, legumes e carne',
          isDiet: true,
          date: '2023/07/15',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(200)

      console.log(updateSnackResponse.body)

      expect(updateSnackResponse.body.snack).toEqual(
        expect.objectContaining({
          name: 'Almoço',
          description: 'arroz, feijão, salada, legumes e carne',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
      )
    })
  })

  describe('Get Snack', async () => {
    it('should be able to show all snacks created for a user with idSession exists', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user6',
          email: 'user6@vitest.com',
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
          name: 'Almoço',
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
          name: 'Café da Tarde',
          description: 'banana, ovos, bacon e igourte',
          isDiet: true,
          date: '2023/07/15',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(201)

      const listSnacksResponse = await request(app.server)
        .get('/api/snacks')
        .set('Cookie', cookie)
        .expect(200)
      console.log(listSnacksResponse.body)
      expect(listSnacksResponse.body.snacks).toEqual([
        expect.objectContaining({
          name: 'Café da manhã',
          description: 'banana, ovos, bacon e igourte',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
        expect.objectContaining({
          name: 'Almoço',
          description: 'banana, ovos, bacon e igourte',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
        expect.objectContaining({
          name: 'Café da Tarde',
          description: 'banana, ovos, bacon e igourte',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
      ])
    })

    it('should be able to show a snack created for a user with idSession exists', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user6',
          email: 'user6@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      const createSnackResponse = await request(app.server)
        .post('/api/snacks')
        .send({
          name: 'Café da Tarde',
          description: 'banana, ovos, bacon e igourte',
          isDiet: true,
          date: '2023/07/15',
          time: '15:00',
        })
        .set('Cookie', cookie)
        .expect(201)

      const { id } = createSnackResponse.body.snack[0]

      const getSnacksResponse = await request(app.server)
        .get(`/api/snacks/${id}`)
        .set('Cookie', cookie)
        .expect(200)
      console.log(getSnacksResponse.body)

      expect(getSnacksResponse.body).toEqual(
        expect.objectContaining({
          name: 'Café da Tarde',
          description: 'banana, ovos, bacon e igourte',
          isDiet: 1,
          date: '2023/07/15',
          time: '15:00',
        }),
      )
    })
  })

  describe('Delete Snack', async () => {
    it('should be able to delete a snack created for user with idSession exists', async () => {
      const createUsersResponse = await request(app.server)
        .post('/api/users')
        .send({
          name: 'user6',
          email: 'user6@vitest.com',
        })
        .expect(201)

      const cookie = createUsersResponse.get('Set-Cookie')

      const createSnackResponse = await request(app.server)
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
      const { id } = createSnackResponse.body.snack[0]
      const deleteSnackResponse = await request(app.server)
        .delete(`/api/snacks/${id}`)
        .set('Cookie', cookie)
        .expect(200)

      console.log(deleteSnackResponse.body)
      expect(deleteSnackResponse.body).toEqual(
        expect.objectContaining({
          deleteSnack: 1,
        }),
      )
    })
  })
})
