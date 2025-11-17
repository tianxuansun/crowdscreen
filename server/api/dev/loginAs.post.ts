import { eventHandler, createError, getQuery } from 'h3';
import { signToken } from '../../utils/auth';
import type { Role } from '../../utils/roles';

export default eventHandler((event) => {
  if (process.env.AUTH_DEV_BYPASS !== 'true') {
    throw createError({ statusCode: 403, statusMessage: 'Dev login disabled' });
  }

  const query = getQuery(event);
  const role = (query.role as Role) || 'moderator';
  const email = (query.email as string) || 'mod@demo.dev';

  // Generate a token with all necessary claims
  const token = signToken({
    sub: 'dev-user-id',
    email,
    role,
  });

  console.log('[loginAs] Generated token:', token); // Debugging

  return { token, user: { id: 'dev-user-id', email, role } };
});
