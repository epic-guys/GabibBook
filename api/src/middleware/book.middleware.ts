import { Request, Response } from 'express';
import Joi from 'joi';

export async function validateBook(req: Request, res: Response, next: Function) {

     const today = new Date( new Date().setHours(0,0,0,0) );

     const baseSchema = Joi.object({
          title: Joi.string().min(2).max(50),
          isbn: Joi.string().pattern(new RegExp('^[0-9]{13}$')),
          author: Joi.string().min(2).max(50),
          start_price: Joi.number().min(0.01),
          reserve_price: Joi.number().min(Joi.ref('start_price')),
          cover: Joi.string().min(2),
          degree_course: Joi.string().min(2),
          open_date: Joi.date().min(today.toISOString()),
          close_date: Joi.date().iso().min(Joi.ref('open_date'))
     });

     const postSchema = baseSchema.fork(Object.keys(baseSchema.describe().keys), (schema) => schema.required());

     const schema = req.method === 'POST' ? postSchema : baseSchema;

     const { error } = schema.validate(req.body, { stripUnknown: true });
     
     if (error) return res.status(400).json({ message: error.details[0].message });

     next();
}

export async function validateOffer(req: Request, res: Response, next: Function) {
     const schema = Joi.object({
          value: Joi.number().positive().required()
     });

     const { error } = schema.validate(req.body, { stripUnknown: true });

     if (error) return res.status(400).json({ message: error.details[0].message });

     next();
}
