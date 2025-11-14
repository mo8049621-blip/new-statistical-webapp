// 使用 ES 模块语法的验证脚本
console.log('验证导入路径...');
try {
  // 尝试导入模块以验证路径正确性
  import('./src/client/utils/dataGenerators.js').then((dataGenerators) => {
    console.log('✅ 成功导入 dataGenerators 模块！');
    console.log('模块导出的函数:', Object.keys(dataGenerators));
  }).catch((error) => {
    console.error('❌ 导入失败:', error.message);
  });
} catch (error) {
  console.error('❌ 代码执行失败:', error.message);
}