class FileUtil {
  constructor(elementClass) {
    this.file = null;
    this.element = null;

    this._init(elementClass);
  }

  _init(elementClass) {
    this._getElement(elementClass);
  }

  _getElement(elementClass) {
    const element = document.querySelector(elementClass);
    if (element.type !== 'file') {
      throw new Error('文件工具必须传入file类型的input');
    }
    this.element = element;
  }

  build() {
    return new Promise((resolve, reject) => {
      const fileInput = this.element;
      fileInput.click();
      fileInput.onchange = () => {
        this.file = fileInput.files[0];
        if (!this.file) {
          reject('no file');
        }
        resolve(true);
      };
    });
  }

  async getFileText() {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        let content;
        reader.readAsText(this.file, 'utf-8');
        reader.onload = (ev) => {
          content = ev.target.result;
          resolve(content);
        };
      } catch (e) {
        reject(e.message);
      }
    });
  }

  async getFileName() {
    return this.element.files[0].name;
  }

  async getFilePath() {
    return this.element.files[0].path;
  }
}

export default FileUtil;
