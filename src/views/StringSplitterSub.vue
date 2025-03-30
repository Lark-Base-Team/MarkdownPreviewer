<!--
 * @Version    : v1.0
 * @Author     : Wang Chao
 * @Date       : 2023-09-26 15:10
 * @LastAuthor : Wang Chao
 * @LastTime   : 2023-09-26 15:10
 * @desc       : 字符串拆分工具
-->
<script setup>
import { ref, onMounted } from 'vue';
import { bitable } from '@lark-base-open/js-sdk';
import { ElMessage, ElButton, ElSelect, ElOption, ElDialog, ElInput, ElLoading } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 表格和字段选择
const sourceTableList = ref([]);
const sourceTableId = ref('');
const sourceViewList = ref([]);
const sourceViewId = ref('');
const sourceFieldList = ref([]);
const sourceFieldId = ref('');

const targetTableList = ref([]);
const targetTableId = ref('');
const targetViewList = ref([]);
const targetViewId = ref('');
const targetFieldList = ref([]);
const targetFieldId = ref('');

// 处理状态
const isProcessing = ref(false);
const processResult = ref({
  total: 0,
  processed: 0,
  inserted: 0,
});

// 分隔符设置
const separator = ref('\n');
const customSeparator = ref(false);

// 结果对话框
const resultDialogVisible = ref(false);

const base = bitable.base;

// 初始化数据
onMounted(async () => {
  try {
    // 获取所有表格
    sourceTableList.value = await base.getTableMetaList();
    targetTableList.value = [...sourceTableList.value];
    
    // 默认选择当前表格
    const selection = await base.getSelection();
    if (selection && selection.tableId) {
      sourceTableId.value = selection.tableId;
      targetTableId.value = selection.tableId;
      
      // 加载源表视图
      await loadSourceViews();
      
      // 如果有视图ID，默认选择
      if (selection.viewId) {
        sourceViewId.value = selection.viewId;
        await loadSourceFields();
      }
      
      // 加载目标表视图
      await loadTargetViews();
    }
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('初始化失败: ' + error.message);
  }
});

// 加载源表视图
async function loadSourceViews() {
  if (!sourceTableId.value) return;
  
  try {
    const table = await base.getTable(sourceTableId.value);
    sourceViewList.value = await table.getViewMetaList();
    sourceViewId.value = sourceViewList.value[0]?.id || '';
    
    // 重置字段选择
    sourceFieldList.value = [];
    sourceFieldId.value = '';
    
    // 加载字段
    if (sourceViewId.value) {
      await loadSourceFields();
    }
  } catch (error) {
    console.error('加载视图失败:', error);
    ElMessage.error('加载视图失败: ' + error.message);
  }
}

// 加载源表字段
async function loadSourceFields() {
  if (!sourceTableId.value || !sourceViewId.value) return;
  
  try {
    const table = await base.getTable(sourceTableId.value);
    const view = await table.getViewById(sourceViewId.value);
    const fields = await view.getFieldMetaList();
    
    // 只保留文本类型字段
    sourceFieldList.value = fields.filter(field => field.type === 1 || field.type === 20);
    sourceFieldId.value = '';
  } catch (error) {
    console.error('加载字段失败:', error);
    ElMessage.error('加载字段失败: ' + error.message);
  }
}

// 加载目标表视图
async function loadTargetViews() {
  if (!targetTableId.value) return;
  
  try {
    const table = await base.getTable(targetTableId.value);
    targetViewList.value = await table.getViewMetaList();
    targetViewId.value = targetViewList.value[0]?.id || '';
    
    // 重置字段选择
    targetFieldList.value = [];
    targetFieldId.value = '';
    
    // 加载字段
    if (targetViewId.value) {
      await loadTargetFields();
    }
  } catch (error) {
    console.error('加载视图失败:', error);
    ElMessage.error('加载视图失败: ' + error.message);
  }
}

// 加载目标表字段
async function loadTargetFields() {
  if (!targetTableId.value || !targetViewId.value) return;
  
  try {
    const table = await base.getTable(targetTableId.value);
    const view = await table.getViewById(targetViewId.value);
    const fields = await view.getFieldMetaList();
    
    // 只保留文本类型字段
    targetFieldList.value = fields.filter(field => field.type === 1);
    targetFieldId.value = '';
  } catch (error) {
    console.error('加载字段失败:', error);
    ElMessage.error('加载字段失败: ' + error.message);
  }
}

// 执行拆分并插入操作
async function splitAndInsert() {

  // 定义要排除的字段类型
const EXCLUDED_FIELD_TYPES = [17, 18]; // 17:附件, 18:其他类型

// 在循环中添加判断
  // 验证输入
  if (!sourceTableId.value || !sourceViewId.value || !sourceFieldId.value) {
    ElMessage.warning('请选择源表、视图和字段');
    return;
  }
  
  if (!targetTableId.value || !targetViewId.value || !targetFieldId.value) {
    ElMessage.warning('请选择目标表、视图和字段');
    return;
  }
  
  // 显示加载状态
  isProcessing.value = true;
  processResult.value = {
    total: 0,
    processed: 0,
    inserted: 0,
  };
  
  try {
    // 获取源表和目标表
    const sourceTable = await base.getTable(sourceTableId.value);
    const targetTable = await base.getTable(targetTableId.value);
    
    // 获取源表视图中的所有记录ID
    const sourceView = await sourceTable.getViewById(sourceViewId.value);
    const recordIds = await sourceView.getVisibleRecordIdList();
    
    // 获取源表所有字段元数据（用于识别附件类型字段）
    const sourceFieldMetaList = await sourceView.getFieldMetaList();
    
    processResult.value.total = recordIds.length;
    
    // 处理每条记录
    for (const recordId of recordIds) {
      // 获取整个记录的所有字段值
      const record = await sourceTable.getRecordById(recordId);
      
      if (record) {
        // 获取要拆分的单元格值
        const cellValue = record.fields[sourceFieldId.value];
        
        if (cellValue && cellValue.length > 0) {
          // 获取文本内容
          const text = cellValue.map(item => item.text).join('\n');
          
          // 根据分隔符拆分文本
          const splitSeparator = customSeparator.value ? separator.value : '\n';
          const lines = text.split(splitSeparator).filter(line => line.trim() !== '');
          
          // 准备其他字段的值（排除要拆分的字段和附件类型字段）
          const otherFields = {};
          for (const fieldId in record.fields) {
            // 跳过要拆分的字段
            if (fieldId === sourceFieldId.value) continue;
            
            // 获取字段元数据
            const fieldMeta = sourceFieldMetaList.find(f => f.id === fieldId);
            
            // 跳过附件类型字段（type 17 通常是附件类型）
            if (fieldMeta && EXCLUDED_FIELD_TYPES.includes(fieldMeta.type)) continue;
            
            // 添加其他字段值
            otherFields[fieldId] = record.fields[fieldId];
          }
          
          // 将每一行插入到目标表
          for (const line of lines) {
            await targetTable.addRecord({
              fields: {
                ...otherFields, // 添加其他字段值（已排除附件类型）
                [targetFieldId.value]: [{ type: 'text', text: line.trim() }] // 添加拆分后的值
              }
            });
            processResult.value.inserted++;
          }
        }
      }
      
      processResult.value.processed++;
    }
    
    // 显示结果对话框
    resultDialogVisible.value = true;
    
    ElMessage.success(`处理完成！共处理 ${processResult.value.processed} 条记录，插入 ${processResult.value.inserted} 行数据`);
  } catch (error) {
    console.error('处理失败:', error);
    ElMessage.error('处理失败: ' + error.message);
  } finally {
    isProcessing.value = false;
  }
}

</script>

<template>
  <div class="string-splitter">
    
    <div class="section">
      <h3 class="section-title">{{ $t('splitter.source') || '源数据' }}</h3>
      
      <div class="form-item">
        <label>{{ $t('splitter.sourceTable') || '源表格' }}：</label>
        <el-select 
          v-model="sourceTableId" 
          @change="loadSourceViews"
          :placeholder="$t('splitter.selectTable') || '请选择表格'"
          class="select-input"
        >
          <el-option
            v-for="table in sourceTableList"
            :key="table.id"
            :label="table.name"
            :value="table.id"
          />
        </el-select>
      </div>
      
      <div class="form-item">
        <label>{{ $t('splitter.sourceView') || '源视图' }}：</label>
        <el-select 
          v-model="sourceViewId" 
          @change="loadSourceFields"
          :placeholder="$t('splitter.selectView') || '请选择视图'"
          class="select-input"
          :disabled="!sourceTableId"
        >
          <el-option
            v-for="view in sourceViewList"
            :key="view.id"
            :label="view.name"
            :value="view.id"
          />
        </el-select>
      </div>
      
      <div class="form-item">
        <label>{{ $t('splitter.sourceField') || '源字段' }}：</label>
        <el-select 
          v-model="sourceFieldId" 
          :placeholder="$t('splitter.selectField') || '请选择字段'"
          class="select-input"
          :disabled="!sourceViewId"
        >
          <el-option
            v-for="field in sourceFieldList"
            :key="field.id"
            :label="field.name"
            :value="field.id"
          >
            <span style="display: flex; align-items: center; gap: 4px">
              <span style="font-family: monospace; font-size: 12px; color: #8f959e">
                {{ field.type === 1 ? 'A=' : 'ƒx' }}
              </span>
              {{ field.name }}
            </span>
          </el-option>
        </el-select>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">{{ $t('splitter.target') || '目标数据' }}</h3>
      
      <div class="form-item">
        <label>{{ $t('splitter.targetTable') || '目标表格' }}：</label>
        <el-select 
          v-model="targetTableId" 
          @change="loadTargetViews"
          :placeholder="$t('splitter.selectTable') || '请选择表格'"
          class="select-input"
        >
          <el-option
            v-for="table in targetTableList"
            :key="table.id"
            :label="table.name"
            :value="table.id"
          />
        </el-select>
      </div>
      
      <div class="form-item">
        <label>{{ $t('splitter.targetView') || '目标视图' }}：</label>
        <el-select 
          v-model="targetViewId" 
          @change="loadTargetFields"
          :placeholder="$t('splitter.selectView') || '请选择视图'"
          class="select-input"
          :disabled="!targetTableId"
        >
          <el-option
            v-for="view in targetViewList"
            :key="view.id"
            :label="view.name"
            :value="view.id"
          />
        </el-select>
      </div>
      
      <div class="form-item">
        <label>{{ $t('splitter.targetField') || '目标字段' }}：</label>
        <el-select 
          v-model="targetFieldId" 
          :placeholder="$t('splitter.selectField') || '请选择字段'"
          class="select-input"
          :disabled="!targetViewId"
        >
          <el-option
            v-for="field in targetFieldList"
            :key="field.id"
            :label="field.name"
            :value="field.id"
          >
            <span style="display: flex; align-items: center; gap: 4px">
              <span style="font-family: monospace; font-size: 12px; color: #8f959e">
                {{ field.type === 1 ? 'A=' : 'ƒx' }}
              </span>
              {{ field.name }}
            </span>
          </el-option>
        </el-select>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">{{ $t('splitter.settings') || '拆分设置' }}</h3>
      
      <div class="form-item">
        <label>
          <input type="checkbox" v-model="customSeparator" />
          {{ $t('splitter.customSeparator') || '自定义分隔符' }}
        </label>
      </div>
      
      <div class="form-item" v-if="customSeparator">
        <label>{{ $t('splitter.separator') || '分隔符' }}：</label>
        <el-input 
          v-model="separator" 
          :placeholder="$t('splitter.separatorPlaceholder') || '请输入分隔符'"
          class="select-input"
        />
      </div>
    </div>
    
    <div class="actions">
      <el-button 
        type="primary" 
        @click="splitAndInsert" 
        :loading="isProcessing"
        :disabled="!sourceFieldId || !targetFieldId"
      >
        {{ isProcessing ? ($t('splitter.processing') || '处理中...') : ($t('splitter.execute') || '执行拆分') }}
      </el-button>
    </div>
    
    <!-- 结果对话框 -->
    <el-dialog
      v-model="resultDialogVisible"
      :title="$t('splitter.result') || '处理结果'"
      width="300px"
    >
      <div class="result-content">
        <p>{{ $t('splitter.totalRecords') || '总记录数' }}: {{ processResult.total }}</p>
        <p>{{ $t('splitter.processedRecords') || '处理记录数' }}: {{ processResult.processed }}</p>
        <p>{{ $t('splitter.insertedLines') || '插入行数' }}: {{ processResult.inserted }}</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resultDialogVisible = false">{{ $t('splitter.close') || '关闭' }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.string-splitter {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 24px;
  color: #2955e7;
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  background-color: #f9f9fa;
}

.section-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: #1f2329;
  border-bottom: 1px solid #e5e6eb;
  padding-bottom: 8px;
}

.form-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 100px;
  flex-shrink: 0;
  font-size: 14px;
  color: #4e5969;
}

.select-input {
  flex: 1;
  min-width: 200px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.result-content {
  text-align: center;
}

.result-content p {
  margin: 8px 0;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .form-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-item label {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .select-input {
    width: 100%;
  }
}
</style>