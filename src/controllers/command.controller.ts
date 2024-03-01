import { Request, Response, NextFunction } from 'express';

const processCommand = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ status: "Active" });
};

export default { processCommand };