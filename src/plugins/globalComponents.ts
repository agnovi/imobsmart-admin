import { Dropdown } from 'floating-vue'

import BaseInput from '@/components/Input.vue';
import spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';
import Editor from '@/components/Editor/index.vue';
import Button from '@/components/Button.vue';
import FullSpinner from '@/components/FullSpinner.vue'
import LoadingGit from '@/components/LoadingGit.vue'
import Select from '@/components/Select.vue'

const GlobalComponents = {
  install(Vue: any) {
    Vue.component('base-input', BaseInput);
    Vue.component('Dropdown', Dropdown)
    Vue.component('spinner', spinner)
    Vue.component('base-modal', Modal)
    Vue.component('base-editor', Editor)
    Vue.component('FullSpinner', FullSpinner)
    Vue.component('base-button', Button)
    Vue.component('LoadingGit', LoadingGit)
    Vue.component('base-select', Select)
  }
};

export default GlobalComponents;
