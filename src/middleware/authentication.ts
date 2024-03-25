
import { Request, Response, NextFunction } from "express";

export const authenticateKey = (req: Request,    res: Response,    next: NextFunction) => {
    const errors = [];
    let api_key = req.header("x-api-key"); //Add API key to headers
    
    let authenticated = api_key === process.env['X-API-KEY']; //Check if API key matches process.env['X-API-KEY'];
    if (authenticated) {
      next();
    } else {
        errors.push("Authentication failed!");

        //Reject request if API key doesn't match
        res.status(403).send({ error: { code: 403, message: "You not allowed." } });
    }
    /*// If there are errors - to move before Nexte or within else loop
    // return 403 (Unallowed)
    if (errors.length) {
        return res.status(422).json({
        message: "Not allowed",
        errors,
        });
    }*/
  };
