import { RequestHandler } from 'express-serve-static-core';

declare module 'express-session' {
    interface SessionData {
        userId?: string | null;
    }
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(403).json({
            error: 'Not authenticated',
        });
    }
};
