<script lang="ts" setup>

interface IProps {
  type?: 'button' | 'reset' | 'submit'
  label?: string
  bgColor?: string
  textColor?: string
  borderColor?: string
  classWidth?: string
  theme?: 'primary' | 'error' | 'gray' | 'black' | 'white'
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  variant?: 'outlined' | 'contained'
  size?: 'sm' | 'md' | 'lg' | 'none'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  bgColor: '',
  borderColor: 'bg-primary-500',
  textColor: 'text-white',
  classWidth: 'w-fit',
  size: 'md',
  rounded: 'md',
  theme: 'primary',
  variant: 'contained',
  loading: false,
  type: 'submit'
})


const styles = {
  base: 'relative align-middle flex items-center justify-center focus:outline-none transition ease-in-out duration-300',
  loading: '!text-transparent',
  disabled: {
    outlined: 'border bg-transparent border-gray-400 text-gray-400 cursor-not-allowed',
    contained: 'bg-gray-300 text-gray-800 opacity-70 cursor-not-allowed'
  },
  size: {
    sm: 'px-3 py-2 text-sm h-6 rounded-[3px]',
    md: 'px-6 py-4 h-[30px] rounded-[3px]',
    lg: 'px-8 py-6 h-9 rounded',
    none: 'rounded'
  },
  rounded: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  },
  variants: {
    primary: {
      outlined: {
        base: 'border bg-transparent text-primary-950',
        hover: 'hover:bg-primary-m/[0.12]'
      },
      contained: {
        base: 'bg-primary-500 border',
        hover: 'hover:shadow-md hover:shadow-primary-m/40'
      },
    },
    error: {
      outlined: {
        base: 'border border-solid bg-transparent border-red-400 text-red-400',
        hover: 'hover:bg-tomato-400/[0.12]'
      },
      contained: {
        base: 'bg-tomato-400 border border-tomato-400',
        hover: 'hover:shadow-md hover:shadow-tomato-400/40'
      }
    },
    gray: {
      outlined: {
        base: 'border border-solid bg-transparent border-gray-400 text-gray-400',
        hover: 'hover:bg-gray-400/[0.12]'
      },
      contained: {
        base: 'bg-gray-400 border border-gray-400',
        hover: 'hover:shadow-md hover:shadow-gray-400/40'
      }
    },
    black: {
      outlined: {
        base: 'border border-solid bg-transparent border-gray-900 text-gray-900',
        hover: 'hover:bg-gray-900/[0.12]'
      },
      contained: {
        base: 'bg-gray-900 border border-gray-900',
        hover: 'hover:shadow-md hover:shadow-gray-900/40'
      }
    },
    white: {
      outlined: {
        base: 'border border-solid bg-transparent border-white',
        hover: 'hover:bg-white/[0.12]'
      },
      contained: {
        base: 'bg-white text-gray-900 border border-white',
        hover: 'hover:shadow-md hover:shadow-white/40'
      }
    }
  }
} as any

const emit = defineEmits(['click'])
</script>

<template>
  <button :type="type" :disabled="disabled" :class="[
    styles.base,
    styles.size[props.size],
    styles.rounded[props.rounded],
    props.disabled ? styles.disabled[props.variant] : '',
    (loading && !disabled) ? styles.loading : '',
    !disabled ? styles.variants[props.theme][props.variant].base : '',
    !disabled && !loading ? styles.variants[props.theme][props.variant].hover : '',
    props.classWidth,
    props.bgColor ? props.bgColor : 'bg-primary-500',
    props.textColor,
    props.borderColor,
  ]" @click="emit('click')">
    <svg v-if="loading" aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <slot />
  </button>
</template>