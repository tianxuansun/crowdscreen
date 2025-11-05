export type Role = 'user' | 'moderator' | 'admin'
export const canModerate = (role?: Role) => role === 'moderator' || role === 'admin'
