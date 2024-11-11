import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { CREATED, DELETED, UPDATED } from '../../../middleware/error.middleware'

export async function createLesson(req, res: Response) {
  const json = req.body
  const { type } = req.query

  try {
    const newItem = await db('lesson').insert({ data: json, type }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, lessonId: newItem[0].id })
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getLessons(req: Request, res: Response) {
  try {
    const getLessons = await db.select('*').from('lesson')

    return res.status(200).json({ getLessons })
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function getLessonsById(req: Request, res: Response) {
  const { idArr } = req.query

  const tmp: any = idArr

  // Преобразуем строку в массив, если необходимо
  const ids = Array.isArray(tmp) ? tmp : tmp.split(',').map((id) => id.trim())

  console.log(ids)

  try {
    // Выполняем SQL-запрос
    const getLessons = await db.select('*').from('lesson').whereIn('id', ids)

    if (getLessons.length === 0) {
      return res.status(404).json({ message: 'No lessons found for the provided IDs' })
    }

    return res.status(200).json(getLessons)
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function getLessonById(req: Request, res: Response) {
  const { id } = req.params

  try {
    const lesson = await db.select('*').from('lesson').where('id', id).first()

    if (lesson) {
      return res.status(200).json(lesson)
    } else {
      return res.status(404).json({ message: 'Lesson not found' })
    }
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateLesson(req: Request, res: Response) {
  const newJson = req.body
  const { id, type } = req.query

  try {
    await db.table('lesson').update({ data: newJson, type }).where('id', id)

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function deleteLesson(req: Request, res: Response) {
  const { id } = req.query

  try {
    await db('lesson').where({ id }).del()

    return res.status(200).json({ message: DELETED })
  } catch (error) {
    console.error('Error in lesson.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
