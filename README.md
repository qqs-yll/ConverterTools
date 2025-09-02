# 🔄 转换工具 (Converter Tools)

一个基于Next.js的在线单位转换工具平台，支持多种单位转换功能。

## ✨ 功能特性

- **货币转换**: 支持实时汇率和固定汇率
- **重量转换**: 千克、克、磅、盎司等
- **长度转换**: 米、厘米、英尺、英寸等
- **体积转换**: 升、毫升、加仑、立方米等
- **温度转换**: 摄氏度、华氏度、开尔文等
- **时区转换**: 全球时区转换
- **多语言支持**: 中文和英文
- **响应式设计**: 支持移动端和桌面端

## 🚀 技术栈

- **前端框架**: Next.js 14 + React 19
- **样式**: Tailwind CSS + Material-UI
- **语言**: TypeScript
- **部署**: Vercel

## 📁 项目结构

```
ConverterTools/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   └── convert/       # 转换API
│   │   ├── converter/         # 转换器页面
│   │   │   ├── currency/      # 货币转换
│   │   │   ├── weight/        # 重量转换
│   │   │   ├── length/        # 长度转换
│   │   │   ├── volume/        # 体积转换
│   │   │   ├── temperature/   # 温度转换
│   │   │   └── timezone/      # 时区转换
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   ├── contexts/              # React上下文
│   ├── i18n/                  # 国际化
│   ├── locales/               # 语言包
│   ├── types/                 # TypeScript类型
│   ├── utils/                 # 工具函数
│   └── config.ts              # 配置文件
├── public/                    # 静态资源
├── package.json               # 项目配置
├── next.config.js             # Next.js配置
├── tailwind.config.js         # Tailwind配置
└── tsconfig.json              # TypeScript配置
```

## 🛠️ 本地开发

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **构建生产版本**:
   ```bash
   npm run build
   ```

4. **启动生产服务器**:
   ```bash
   npm start
   ```

## 🌐 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel上导入项目
3. 自动部署完成

### 其他平台

项目支持部署到任何支持Next.js的平台。

## 📱 API端点

- `POST /api/convert/currency` - 货币转换
- `POST /api/convert/weight` - 重量转换
- `POST /api/convert/length` - 长度转换
- `POST /api/convert/volume` - 体积转换
- `POST /api/convert/temperature` - 温度转换
- `POST /api/convert/timezone` - 时区转换

## 🤝 贡献

欢迎提交Issue和Pull Request！

## �� 许可证

MIT License 