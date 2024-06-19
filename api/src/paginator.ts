import { Request, Response } from 'express'

module.exports = (req: Request, res: Response, next: Function) => {

     const page = Number(req.query.page);
     const size = Number(req.query.size);
 
     if (page < 0) res.status(400).send({ message: 'Invalid page number' });
 
     if (size < 0) res.status(400).send({ message: 'Invalid size' });

     next();
}