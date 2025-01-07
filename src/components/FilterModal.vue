<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { http } from '@/api/api';
import { residentialOptions } from '@/util/constants'
import Select from '@/components/Select.vue'
import MinMaxInput from '@/components/MinMaxInput.vue'
import NumberList from '@/components/NumberList.vue'
import Button from '@/components/Button.vue'
import ModalFilter from '@/components/ModalFilter.vue'
import IconBath from '@/components/icones/Bath.vue'
import IconBed from '@/components/icones/Bed.vue'
import IconCar from '@/components/icones/Car.vue'
import IconSearch from '@/components/icones/Search.vue'
import CheckboxInput from '@/components/CheckboxInput.vue'
interface IProps {
    isOpen: boolean;
}
const props = defineProps<IProps>();

const emit = defineEmits(['close', 'filter']);

const closeModal = () => {
    emit('close');
};

const confirmAction = () => {
    emit('filter', { isFilterModal: true, ...filter.value});
    closeModal()
};

const maskaOptMoney = {
    number: {
        locale: 'uk',
        fraction: 2,
        unsigned: true
    },
}

const maskaOptArea = {
    number: {
        locale: 'de',
        fraction: 0,
        unsigned: true
    }
};
const selected = ref({
    bedroom: 1,
    garage: 1,
    suite: 1,
});

const filter = ref<any>({
    finalidade: {
        venda: false,
        locacao: false,
    },
    base: '',
    bedroom: [],
    garage: [],
    suite: [],
    reference: '',
    type: '',
    cities: [],
    neighborhoods: [],
    logradouro: '',
    price: {
        min: '',
        max: '',
    },
    area: {
        min: '',
        max: '',
    },
    bedrooms: 5,
    suites: 5,
    status: '',
    broker: '',

});

const itemsCheckbox = ref([
    { label: 'Venda', checked: false },
    { label: 'Locação', checked: false },
]);

const optionsBase = [
    { value: 1, label: 'Base 1' },
    { value: 2, label: 'Base 2' },
    { value: 3, label: 'Base 3' },
    { value: 4, label: 'Base 4' },
    { value: 5, label: 'Base 5' },
];

const optionsType = [
    { value: 1, label: 'Casa' },
    { value: 2, label: 'Apartamento' },
    { value: 3, label: 'Sobrado' },
    { value: 4, label: 'Cobertura' },
    { value: 5, label: 'Kitnet' },
];

const optionsCities = ref([]);

const optionsNeighborhoods = ref([])

const optionsStatus = [
    { value: 1, label: 'Disponível' },
    { value: 2, label: 'Vendido' },
    { value: 3, label: 'Alugado' },
];

const optionsBrokers = [
    { value: 1, label: 'João' },
    { value: 2, label: 'Maria' },
    { value: 3, label: 'José' },
    { value: 4, label: 'Pedro' },
    { value: 5, label: 'Ana' },
];

const handleItemsUpdate = (updatedItems: { label: string; checked: boolean }[]) => {
    itemsCheckbox.value = updatedItems;
    filter.value.finalidade.venda = updatedItems[0].checked;
    filter.value.finalidade.locacao = updatedItems[1].checked;
};

const clearFields = () => {
    filter.value = {
        finalidade: {
            venda: false,
            locacao: false,
        },
        bedroom: [],
        garage: [],
        suite: [],
        base: '',
        reference: '',
        type: '',
        cities: [],
        neighborhoods: [],
        logradouro: '',
        price: {
            min: '',
            max: '',
        },
        area: {
            min: '',
            max: '',
        },
        status: '',
        broker: '',
    };
    selected.value = {
        bedroom: 1,
        garage: 1,
        suite: 1,
    };

    confirmAction()

    closeModal()
};

async function getCities() {
    try {
        const res = await http.get('/property/listCity');
        optionsCities.value = res.data?.map((item: any) => ({
            value: item,
            label: item,
        }));
    } catch (error) {
        console.log(error);
    }
}

async function getBairros() {
    try {
        if (!filter.value?.cities?.length) {
            optionsNeighborhoods.value = [];
            return;
        }
        const res = await http.get(`/property/listNeighborhood${filter.value?.cities?.map((city: string, idx: number) => idx === 0 ? `?city=${city}` : `&city=${city}`).join('')}`);
        optionsNeighborhoods.value = res.data?.map((item: any) => ({
            value: item,
            label: item,
        }));
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getCities();
    const filtersJson = localStorage.getItem('filters');
    const filtersObject = filtersJson ? JSON.parse(filtersJson) : null;

    if (filtersObject) {
        filter.value = filtersObject
    }
});
</script>

<template>

    <ModalFilter title="Filtros" :isOpen="isOpen" @close="closeModal" @confirm="confirmAction">
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div class="col-span-12 md:col-span-2 xl:col-span-2">
                <base-input v-model="filter.nameTable" name="Nome da Tabela" placeholder="Ex. nome tabela"
                    label="Nome da Tabela" />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-2">
                <base-input v-model="filter.linkTable" name="link da tabela"
                    placeholder="Ex. https://exemplotabela.com.br" label="Link da Tabela" />
            </div>

            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <base-input v-model="filter.reference" name="referencia" placeholder="Ex. 1234" label="Referência" />
            </div>

            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <CheckboxInput label="Finalidade" :items="itemsCheckbox" @update:items="handleItemsUpdate" />
            </div>
            <!-- <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <Select v-model="filter.base" name="base" label="Base de Imóveis" :options="optionsBase" />
            </div> -->

            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <Select v-model="filter.type" name="type" label="Tipo do Imóvel" :options="residentialOptions" />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <Select multiple v-model="filter.cities" name="cities" label="Cidades"
                    placeholder="Selecionar cidades" :options="optionsCities" @input="getBairros" />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <Select multiple v-model="filter.neighborhoods" name="neighborhoods" label="Bairros"
                    placeholder="Selecionar bairros" :options="optionsNeighborhoods" />
            </div>
            <div class="col-span-12 md:col-span-3 xl:col-span-3">
                <base-input v-model="filter.logradouro" name="logradouro" placeholder="Ex. Rua das Flores"
                    label="Logradouro" />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <MinMaxInput v-model="filter.price" label="Valor" bottom-text="Preço" preffix="R$"
                    :maska="maskaOptMoney" isMoney />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <MinMaxInput v-model="filter.area" label="Área" bottom-text="m²" :maska="maskaOptArea" />
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <NumberList v-model="filter.bedroom" title="Quartos" :quantity="4">
                    <template #icon>
                        <IconBed class="w-5 h-5" />
                    </template>
                </NumberList>
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <NumberList v-model="filter.garage" title="Garagem" :quantity="4">
                    <template #icon>
                        <IconCar class="w-5 h-5" />
                    </template>
                </NumberList>
            </div>
            <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <NumberList v-model="filter.suite" title="Suítes" :quantity="4">
                    <template #icon>
                        <IconBath class="w-5 h-5" />
                    </template>
                </NumberList>
            </div>
            <!-- <div class="col-span-12 md:col-span-2 xl:col-span-1">
                <Select v-model="filter.status" name="status" placeholder="Selecionar status" label="Status"
                    :options="optionsStatus" />
            </div> -->
            <!-- <div class="col-span-12 md:col-span-2 xl:col-span-2">
                <Select v-model="filter.broker" name="broker" placeholder="Selecionar corretor" label="Corretor"
                    :options="optionsBrokers" />
            </div> -->
        </div>
        <template #actions>
            <Button size="lg" @click="confirmAction">
                <IconSearch class="mr-2" /> Buscar imóveis
            </Button>
            <Button variant="outlined" bgColor="bg-transparent" textColor="text-primary-950" size="lg" @click="clearFields">Limpar Filtros
            </Button>
        </template>
    </ModalFilter>

</template>


<style scoped></style>