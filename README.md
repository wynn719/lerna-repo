## Getting Started

```bash
yarn run boot
```

## Development

### 新建项目

```bash
mkdir packages/<package-name>
cd <package-name>
yarn init
```

### 依赖安装

1. 给 root 项目安装共享依赖，构建类包都可以通过这种方式安装

```bash
yarn add -W <package-name>
# yarn add -W --dev eslint prettier
```

2. 给特定 package 安装依赖，依赖只用于本身

```bash
yarn workspace <package-name> add <package-name>
# yarn workspace @wynn721/vue-components add vue
```

### 指定项目运行 npm script

通过 lerna 运行

```bash
lerna run --scope <package-name> <command>
# 指定 util 包运行 test 命令
# lerna run --scope @wynn721/util test 
```

通过 yarn 运行

```bash
yarn workspace <package-name> run <command>
# yarn workspace @wynn721/util run test
```

## Publish

```bash
yarn run publish
```