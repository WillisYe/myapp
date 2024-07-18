const fs = require('fs');
const path = require('path');

module.exports = function (content) {
  var output = ''
  var moudle = this.resource.split('\\src\\')[1]
  console.log(moudle)
  var dir = moudle.replace(/[?&=]/g, '_')

  var type = 'js'
  if (moudle.includes('type=style')) {
    type = 'css'
  }
  if (moudle.includes('type=template')) {
    type = 'html'
  }

  if (type == 'html') {
    let returnContent = content.replace(/<\/el-/g, '\n</el-')
    returnContent = returnContent.replace(/<el-/g, '\n<el-')
    returnContent = returnContent.replace(/<input/g, '\n<input')

    var regInput = /<(input)([^<>]*)>/g // tmp
    let contentArr = returnContent.split('\n')
    let resultArr = contentArr.map((item, index) => {
      if (regInput.test(item)) {
        item = item.replace(/<input/g, '<input name="input_name"')
      }
      return item
    })
    const result = resultArr.join('\n')
    output = result
    
    createDirAndWriteFile(`.output/${dir}已处理`, `old.${type}`, content);
    createDirAndWriteFile(`.output/${dir}已处理`, `new.${type}`, output);
  } else {
    output = content;

    createDirAndWriteFile(`.output/${dir}未处理`, `old.${type}`, content);
    createDirAndWriteFile(`.output/${dir}未处理`, `new.${type}`, output);
    // for (const key in this) {
    //   if (Object.hasOwnProperty.call(this, key)) {
    //     const element = this[key];
    //     try {
    //       if (typeof element == 'object') {
    //         createDirAndWriteFile(`.output/${dir}未处理`, `${key}.json`, JSON.stringify(element, null, 2));
    //       } else {
    //         createDirAndWriteFile(`.output/${dir}未处理`, `${key}.txt`, element);
    //       }
          
    //     } catch (error) {

    //     }
    //   }
    // }
  }

  return output
}

function createDirAndWriteFile(dirPath, fileName, content) {
  // 创建目录  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 拼接文件路径  
  const filePath = path.join(dirPath, fileName);

  // 写入文件  
  fs.writeFileSync(filePath, content);
}