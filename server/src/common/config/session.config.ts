import session from 'express-session';
import { envConfig } from './env.config';
export const SESSION_AUTH_KEY = 'SESSION_AUTH';

export function sessionConfig(): session.SessionOptions {
	const env = envConfig();
	const __prod__ = env.mode === 'production';
	// In-memory storage
	return {
		name: SESSION_AUTH_KEY,
		secret: 'some_strong_secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: __prod__,
			maxAge: env.jwtRefreshExpiredTime, // 30 days --> need >= max of alive time of refresh token
			sameSite: 'lax', // csrf
			domain: __prod__ ? '.codeponder.com' : undefined,
		},
	};
}