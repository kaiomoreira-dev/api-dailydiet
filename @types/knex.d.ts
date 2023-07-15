import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      inSequency: number
      bestSequency: number
      idSession: string
      createdAt: string
    }
    snacks: {
      id: string
      idUser: string
      name: string
      description: string
      date: string | Date
      time: string | Date
      isDiet: boolean
    }
  }
}
