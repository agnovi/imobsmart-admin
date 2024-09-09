<template>
    <div class="my-4">
        <h2 class="my-4">Criador de Quizz </h2>
        <div class="border p-3">
            <div v-for="(question, index) in quizList" :key="index">
                <div class="mt-6">
                    <h2 class="text-gray-700 text-[20px] mb-1">{{ index + 1 }}. Questão</h2>
                    <base-editor v-model="question.question" />
                </div>

                <div class="flex flex-col gap-2 mb-5 mt-[-30px]">
                    <label>Tipo da pergunta</label>
                    <select v-model="question.type" class="rounded-md">
                        <option value="single_choice">Simples escolha</option>
                        <option value="multi_choice">Multipla escolha</option>
                        <option value="user_input">Texto</option>
                    </select>
                </div>

                <div v-if="question.type === 'single_choice'" class="flex items-center gap-3">
                    <input type="radio" />
                    <base-editor v-model="question.question" />
                </div>
                <button @click="removeQuestion(index)">Remove Question</button>
            </div>
        </div>
        <button @click="addQuestion">Add Question</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const quizList = ref([
    {
        question: '',
        type: 'single_choice',
        choices: ['']
    }
]);

const addQuestion = () => {
    quizList.value.push({
        question: '',
        type: 'single_choice',
        choices: ['']
    });
};

const removeQuestion = (index: any) => {
    quizList.value.splice(index, 1);
};

const addChoice = (questionIndex: any) => {
    quizList.value[questionIndex].choices.push('');
};

const submitQuiz = () => {
    // Do something with the created quiz
    console.log(quizList.value);
};

</script>

<style scoped></style>