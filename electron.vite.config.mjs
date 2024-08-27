import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.js'), // 主进程入口
          dnsProcessor: resolve(__dirname, 'src/main/util/dnsProcessor.js'), // 处理器文件路径
        },
        output: {
          entryFileNames: '[name].js',
          dir: resolve(__dirname, 'out/main'), // 输出目录
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()],
    // 打包renderer下的src、index.html、subdomain.html
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        },
        output: {
          assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
          chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk
          entryFileNames: 'js/[name]-[hash].js', // 指定 chunks 的入口文件
          compact: true,
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString(); // 拆分多个 vendors
            }
          }
        }
      }
    }
  }
});
