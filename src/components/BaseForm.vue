<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'reset'): void;
}>();
const handleSubmit = () => {
  console.log('BaseForm handleSubmit вызван');
  emit('submit');
};

const handleReset = () => {
  console.log('BaseForm handleReset вызван');
  emit('reset');
};

defineExpose({
  submit: handleSubmit,
  reset: handleReset,
});
</script>

<template>
  <form class="base-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <slot name="header">
        <h2>Форма</h2>
      </slot>
    </div>
    <div class="form-body">
      <slot name="body">
        <div>Формы для заполнения</div>
      </slot>
    </div>
    <div class="form-actions">
      <slot name="actions">
        <v-btn type="submit" color="primary">Отправить</v-btn>
        <v-btn color="error" @click="handleReset">Сбросить</v-btn>
      </slot>
    </div>
  </form>
</template>

<style scoped>
.base-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.form-header {
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 10px;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 2px solid #f5f5f5;
}
</style>
