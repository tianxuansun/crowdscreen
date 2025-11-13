<template>
  <div>
    <header class="border-b">
      <nav class="max-w-5xl mx-auto flex items-center justify-between p-4 gap-4">
        <NuxtLink to="/" class="font-bold">CrowdScreen</NuxtLink>
        <div class="flex gap-3">
          <NuxtLink to="/submit">Submit</NuxtLink>
          <NuxtLink to="/queue">Queue</NuxtLink>
          <NuxtLink to="/rules">Rules</NuxtLink>
          <NuxtLink to="/metrics">Metrics</NuxtLink>
          <NuxtLink to="/login">Login</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="max-w-5xl mx-auto p-6">
      <slot />
    </main>
  </div>
</template>
