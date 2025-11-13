export type Role = 'user' | 'moderator' | 'admin'
export const canModerate = (role?: Role) => role === 'moderator' || role === 'admin'
export const isAdmin = (role?: Role) => role === 'admin'
