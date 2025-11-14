// 简单的导入验证脚本
console.log('验证导入路径...');
try {
  // 尝试导入模块以验证路径正确性
  const dataGenerators = require('./src/client/utils/dataGenerators');
  console.log('✅ 成功导入 dataGenerators 模块！');
  console.log('模块导出的函数:', Object.keys(dataGenerators));
} catch (error) {
  console.error('❌ 导入失败:', error.message);
}