class FileUtil {
  constructor(elementClass) {
    const element = document.querySelector(elementClass);
    if (element.type !== 'file') {
      throw new Error('文件工具必须传入file类型的input');
    }
    this._element = element;
  }

  getFileText() {
    const fileInput = this._element;
    return new Promise((resolve, reject) => {
      fileInput.click();
      const reader = new FileReader();
      let content;
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) {
          return;
        }
        reader.readAsText(file, 'utf-8');
      };
      reader.onload = (ev) => {
        content = ev.target.result;
        resolve(content);
      };
    });
  }

  getFileName() {
    return this._element.files[0].name;
  }
}

export default FileUtil;
