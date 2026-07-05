# Clash Nodes App

跨平台桌面端 + 移动端应用（Windows / Android / iOS），提供免费 Clash 代理订阅链接聚合和节点目录。

数据来源 [yoyapai.com](https://yoyapai.com)，每日通过 GitHub Actions 自动更新。

## 功能

- 📋 **订阅链接** — GitHub Raw / CDN 双通道，一键复制
- 🌍 **节点目录** — 按地区过滤、搜索
- 🌓 **暗色/亮色主题** — 跟随系统或手动切换
- 🌐 **中英双语** — 一键切换
- ⚡ **节点测速** — TCP 延迟测试（桌面端可选项）
- 📌 **系统托盘** — 常驻右下角（桌面端可选项）
- 🔔 **更新通知** — 订阅更新时系统弹窗（桌面端可选项）
- 🚀 **开机自启** — 可配置（桌面端可选项）

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | HTML/CSS/Vanilla JS（复用现有网站代码） |
| 后端 | Rust（Tauri v2） |
| 桌面 | Tauri v2 → Windows |
| 移动端 | Tauri v2 → Android / iOS |

## 开发

### 前置要求

- [Node.js](https://nodejs.org/) >= 20
- [Rust](https://rustup.rs/) >= 1.70
- [Tauri CLI](https://tauri.app/) >= 2.0

### 安装依赖

```bash
# 安装 Tauri CLI
cargo install tauri-cli --version "^2"

# 安装前端依赖（本项目无额外依赖）
npm install
```

### 开发模式

```bash
# 桌面端
npm run dev

# Android
npm run android:dev

# iOS (需要 macOS)
npm run ios:dev
```

### 构建

```bash
# Windows (.msi / .exe)
npm run build

# Android (.apk / .aab)
npm run android:build

# iOS (.ipa, 需要 macOS)
npm run ios:build
```

## 项目结构

```
clash-nodes-app/
├── src/                    # 前端源码
│   ├── index.html          # 主页面
│   ├── css/style.css       # 样式
│   └── js/                 # JavaScript 模块
│       ├── i18n.js         # 国际化
│       ├── theme.js        # 主题切换
│       ├── nodes.js        # 节点数据与渲染
│       ├── bridge.js       # Tauri 前后端桥接
│       └── app.js          # 初始化与设置
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   ├── main.rs         # 入口
│   │   ├── lib.rs          # 核心逻辑
│   │   ├── models.rs       # 数据模型
│   │   ├── parser.rs       # YAML 解析
│   │   └── commands/       # Tauri 命令
│   │       ├── fetch.rs    # 数据获取
│   │       ├── settings.rs # 设置管理
│   │       ├── tray.rs     # 系统托盘
│   │       ├── autostart.rs# 开机自启
│   │       └── latency.rs  # 节点测速
│   ├── Cargo.toml
│   └── tauri.conf.json
├── .github/workflows/      # CI/CD
│   ├── build-windows.yml
│   ├── build-android.yml
│   └── build-ios.yml
└── package.json
```

## 浏览器兼容

前端代码在非 Tauri 环境下也可独立运行（普通浏览器），此时桌面特有功能（托盘、测速、通知等）不可用。

## License

MIT
