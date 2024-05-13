import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/user.model'

export async function registration(req: Request, res: Response) {
     
}

export async function login(req: Request, res: Response) {
     
}

export async function getUser(req: Request, res: Response) {
     try {
          const userId = mongoose.mongo.ObjectId.createFromHexString(req.params.id) 
          const user = await User.findById(userId)
          if (!user)
              res.status(404).json({ message: 'User not found' })
          res.json(user)
      } catch (error) {
          res.status(500).json({ message: 'Internal Server Error' })
      }
}

export async function updateUser(req: Request, res: Response) {
     
}

export async function deleteUser(req: Request, res: Response) {
     
}

export async function getAllUsers(req: Request, res: Response) {
     
}