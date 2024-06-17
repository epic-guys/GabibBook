import e, {Request, Response} from "express";
import Joi from "joi";
import {UserType} from "../models/user.model";
import logger from "../logger";

const baseSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    surname: Joi.string().min(2).max(50),
    nickname: Joi.string().alphanum().min(2).max(50),
    email: Joi.string().email(),
    address: Joi.string().min(2),
    city: Joi.string().min(2),
    nation: Joi.string().min(2),
});

const passwordSchema = Joi.string().min(8).required();

const paymentMethodSchema = Joi.object({
    name: Joi.string().min(2).required(),
    fullName: Joi.string().min(2).required(),
    number: Joi.string().min(16).max(16).required(),
    type: Joi.string().min(2).required(),
    expiration: Joi.string().pattern(/0[1-9]|10|11|12\/[0-9]{2}/).required()
});

export async function validateUser(req: Request, res: Response, next: Function) {
    // All fields are required with POST, and the password field is required
    // This is because POST is used only when registering

    let accessCode = (req.body as any).accesscode;

    const postSchema = baseSchema.fork(Object.keys(baseSchema.describe().keys), (schema) => schema.required()).append({password: passwordSchema});

    let schema = req.method === 'POST' ? postSchema : baseSchema;

    if(accessCode) schema = schema.fork(['address', 'city', 'nation'], (schema) => schema.optional());

    const { value, error } = schema.validate(req.body, { stripUnknown: true });
    req.body = value;

    if(accessCode) req.body.accesscode = accessCode;

    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

export async function isSameUser(req: Request, res: Response, next: Function) {
    const user = req.user as UserType;

    //This hecks if the user is the same as the one being requested, if not return 404 (to avoid user enumeration)
    if (req.params.id !== user._id!.toString()) return res.status(404).json({ message: 'User not found' });

    next();
}

export async function validatePassword(req: Request, res: Response, next: Function) {
    const { value, error } = passwordSchema.validate(req.body, { stripUnknown: true });
    req.body = value;

    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}

export async function validatePaymentMethod(req: Request, res: Response, next: Function) {
    const { value, error } = paymentMethodSchema.validate(req.body, { stripUnknown: true });
    req.body = value;

    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
} 

export async function isSameUserOrModerator(req: Request, res: Response, next: Function) {
    const user = req.user as UserType;

    const role = user.role;
    if (role === 'moderator') return next();
    isSameUser(req, res, next);
}