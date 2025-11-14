// 文件存在性检查脚本
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'client', 'utils', 'dataGenerators.ts');

console.log('检查文件是否存在:', filePath);
if (fs.existsSync(filePath)) {
  console.log('✅ 文件存在!');
  const stats = fs.statSync(filePath);
  console.log(`文件大小: ${stats.size} 字节`);
  console.log(`修改时间: ${stats.mtime}`);
  
  // 读取前几行内容验证
  const content = fs.readFileSync(filePath, 'utf8');
  const firstLines = content.split('\n').slice(0, 10).join('\n');
  console.log('文件前几行内容:');
  console.log(firstLines);
} else {
  console.error('❌ 文件不存在!');
}