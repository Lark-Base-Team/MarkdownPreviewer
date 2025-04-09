<!-- <template>
  <div class="app-container">
    <div class="tab-bar">
      <button 
        :class="['tab-button', { active: currentView === 'splitter' }]" 
        @click="switchView('splitter')"
      >
        跨表拆分
      </button>
      <button 
        :class="['tab-button', { active: currentView === 'editor' }]" 
        @click="switchView('editor')"
      >
        文本处理
      </button>
      <button 
        :class="['tab-button', { active: currentView === 'splitterSub' }]" 
        @click="switchView('splitterSub')"
      >
        单表拆分
      </button>
    </div>

    <div class="view-container">
      <MarkdownEditor v-if="currentView === 'editor'" />
      <StringSplitter v-else-if="currentView === 'splitter'" />
      <StringSplitterSub v-else-if="currentView === 'splitterSub'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownEditor from './views/Form.vue';
import StringSplitter from './views/StringSplitter.vue';
import StringSplitterSub from './views/StringSplitterSub.vue';

const currentView = ref('splitter');

function switchView(view) {
  currentView.value = view;
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.tab-bar {
  display: flex;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.tab-button:hover {
  background-color: #e9e9e9;
}

.tab-button.active {
  background-color: #409eff;
  color: white;
}

.view-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style> -->
<script setup>
  import StringSplitter from './views/StringSplitter.vue';
</script>

<template>
  <main>
    <StringSplitter />
  </main>
</template>

<style scoped>
  main {
    padding: 0.5rem;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }
</style>
