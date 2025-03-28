<!--
 * @Version    : v1../views/Form.vue
 * @Author     : Wang Chao
 * @Date       : 2025-02-21 13:44
 * @LastAuthor : Wang Chao
 * @LastTime   : 2025-02-24 16:33
 * @desc       : 
-->
<script setup>
  import { ref, onMounted } from 'vue';
  import Form from './views/Form.vue'; 
  import StringSplitter from './views/StringSplitter.vue';
  import { useI18n } from 'vue-i18n';
  
  const { locale } = useI18n();
  const currentView = ref('splitter'); // 默认显示字符串拆分工具
  
  function switchView(view) {
    currentView.value = view;
  }
  
  onMounted(() => {
    // 设置默认语言为中文
    locale.value = 'zh-CN';
  });
</script>

<template>
  <main>
    <div class="nav-tabs">
      <!-- 注释掉 Markdown 预览按钮-->
      <button 
        :class="['tab-button', { active: currentView === 'form' }]" 
        @click="switchView('form')"
      >
        Markdown 预览
      </button>
      
      <button 
        :class="['tab-button', { active: currentView === 'splitter' }]" 
        @click="switchView('splitter')"
      >
        字符串拆分
      </button>
    </div>
    
    <div class="view-container">
      <Form v-if="currentView === 'form'" />
      <StringSplitter v-if="currentView === 'splitter'" />
    </div>
  </main>
</template>

<style scoped>
  main {
    padding: 0.5rem;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }
  
  .nav-tabs {
    display: flex;
    border-bottom: 1px solid #e5e6eb;
    margin-bottom: 16px;
  }
  
  .tab-button {
    padding: 8px 16px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #4e5969;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
  }
  
  .tab-button:hover {
    color: #2955e7;
  }
  
  .tab-button.active {
    color: #2955e7;
    border-bottom-color: #2955e7;
  }
  
  .view-container {
    min-height: 90vh;
  }
</style>
