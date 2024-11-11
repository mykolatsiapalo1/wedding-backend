import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { CREATED, DELETED, UPDATED } from '../../../middleware/error.middleware'

export async function createSkill(req, res: Response) {
  const { title, iconUrl } = req.query

  try {
    const newItem = await db('skills')
      .insert({ name_skill: title, icon_url: iconUrl })
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, skillId: newItem[0].id })
  } catch (error) {
    console.error('Error in skill.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getSkills(req: Request, res: Response) {
  try {
    const getSkills = await db.select('*').from('skills')

    return res.status(200).json({ getSkills })
  } catch (error) {
    console.error('Error in skill.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateSkill(req: Request, res: Response) {
  const { title, iconUrl, id } = req.query

  try {
    await db.table('skills').update({ name_skill: title, icon_url: iconUrl }).where('id', id)

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in skill.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function deleteSkill(req: Request, res: Response) {
  const { id } = req.query

  try {
    await db('skills').where({ id }).del()

    return res.status(200).json({ message: DELETED })
  } catch (error) {
    console.error('Error in skill.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
