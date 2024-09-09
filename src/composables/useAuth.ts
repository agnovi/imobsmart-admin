import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";

interface UserProps {
    id: string;
    name: string;
}

interface PropsAuthToken {
    access_token: string;
}

interface LoginProps {
    email: string;
    password: string;
}


export const useAuthStore = defineStore('auth', () => {
    const swal:any = inject('$swal')
    const route = useRoute()
    const user = ref<UserProps | null>(null)
    const token = ref<PropsAuthToken | null>(null)
    const loading = ref(false);

    const login = (data:LoginProps) => {
        console.log('datalogin',data)
        loading.value = true
        try {
            throw new Error('Error')
        } catch (error) {
            console.log('error',error)
            Swal.fire( { title: "Oops...",
            text: "E-mail ou senha inválidos",
            icon: "error"})
        } finally {
            loading.value = false
        }
    }

    return { user, token, loading, login }
})