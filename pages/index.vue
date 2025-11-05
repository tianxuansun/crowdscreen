<template>
  <div class="p-8 max-w-3xl mx-auto space-y-4">
    <h1 class="text-3xl font-bold">CrowdScreen</h1>
    <p class="opacity-80">A live queue for community content review.</p>
    <div class="flex gap-3">
      <NuxtLink class="btn btn-primary" to="/login">Login</NuxtLink>
      <NuxtLink class="btn" to="/submit">Submit Content</NuxtLink>
      <NuxtLink class="btn" to="/queue">Moderator Queue</NuxtLink>
      <NuxtLink class="btn" to="/rules">Rules</NuxtLink>
    </div>
  </div>
</template>
