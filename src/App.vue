<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useSession from './composables/useSession';


const defaultLayout = 'default'
const emptyLayout = 'empty'
const session = useSession()
const route = useRoute()


const layout = computed(
  () => `${session.token.value && route.meta.auth ? `${defaultLayout}-layout` : `${emptyLayout}-layout`}`,
)

</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
