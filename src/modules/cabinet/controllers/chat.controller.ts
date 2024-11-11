import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../middleware/error.middleware'

export async function createChat(req, res: Response) {
  const { lessonId, userId } = req.query
  const json = req.body

  try {
    const newItem = await db('chat')
      .insert({ data: json, lesson_id: lessonId, user_id: userId })
      .returning('*')

    console.log(newItem)

    return res.status(201).json({ message: CREATED, chatId: newItem[0].id })
  } catch (error) {
    console.error('Error in chat.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getChats(req: Request, res: Response) {
  try {
    const getChats = await db.select('*').from('chat')

    return res.status(200).json({ getChats })
  } catch (error) {
    console.error('Error in chat.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateChat(req: Request, res: Response) {
  const { lessonId, userId, chatId } = req.query
  const json = req.body

  try {
    await db
      .table('chat')
      .update({ data: json, lesson_id: lessonId, user_id: userId })
      .where('id', chatId)

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in chat.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
