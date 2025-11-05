export default eventHandler((event) => {
  if (!useRuntimeConfig().authDevBypass) throw createError({ statusCode: 403 })
  const { role, email } = getQuery(event)
  const token = JSON.stringify({ role: role || 'moderator', email: email || 'mod@demo' })
  setCookie(event, 'devAuth', token, { httpOnly: false })
  return { ok: true }
})
