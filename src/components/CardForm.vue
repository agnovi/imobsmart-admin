<script setup lang="ts">
// import { computed } from 'vue';

// import Pagination from './Pagination.vue';

interface Props {
  title?: string;
  header?: boolean;
  imgBox?: boolean;
  img?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  header: false
});
// const emits = defineEmits([
//   'editItem',
//   'deleteItem',
//   'itemSort',
//   'update:currentPage',
// ]);
// const currentPage = computed({
//   get() {
//     return props.currentPage;
//   },
//   set: (value) => {
//     emits('update:currentPage', value);
//   },
// });
// METHODS
// function editItem(item: any) {
//   emits('editItem', item);
// }
// function deleteItem(item: any) {
//   emits('deleteItem', item);
// }
// function itemSort(name: string, sort: 'asc' | 'desc') {
//   if (name === 'actions') return;
//   emits('itemSort', { name, sort });
// }
</script>

<template> 
    <div class=" card mt-5" >

       <slot name="content"></slot>
   
  </div>
</template>

<style scoped>
.card{
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  height: 100%;
  padding: 17px;
}
</style>
