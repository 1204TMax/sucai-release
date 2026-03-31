# 量化投放系统 - 开发指南

> 看完这个文档，你就知道怎么给系统加新页面了。

---

## 项目长什么样？

```
素材/
├── index.html          ← 系统框架（菜单、导航栏、标签页）
├── menu-config.js      ← 菜单配置（菜单和页面的对应关系）
├── README.md           ← 你正在看的这个文件
│
├── 首页/               ← 首页模块
│   ├── index.html
│   └── my-tasks.html       （我的任务）
│
├── AI 创作/            ← AI创作模块
│   └── 通用生成.html
│
├── 素材管理/           ← 素材管理模块
│   ├── index.html           （素材库）
│   ├── 物料库.html          （待开发）
│   ├── 原料库.html          （待开发）
│   ├── category.html        （品类管理）
│   └── product.html         （产品管理）
│
└── 系统设置/           ← 系统设置模块
    ├── model-config.html    （模型配置）
    └── compute-cost.html    （算力成本）
```

**三个关键文件的分工：**

| 文件 | 作用 | 你需要改吗？ |
|------|------|-------------|
| `index.html` | 系统框架：顶栏、侧边栏、标签页 | 一般不用改 |
| `menu-config.js` | 菜单和页面的对应关系 | 加新页面时要改 |
| 各模块文件夹里的 `.html` | 页面的实际内容 | 你写的页面放这里 |

---

## 用 AI 开发一个新页面（推荐方式）

直接用自然语言描述需求，Claude 会自动完成创建文件、设计页面、更新菜单三件事。

**指令模板：**

> ⚠️ 必须使用 `ant-design-skill` 进行页面设计，不得跳过。

```
开发「{页面名称}」页面，放到 {模块文件夹路径}，
取名为 {文件名}.html，必须调用 ant-design-skill 进行设计，
并更新 menu-config.js 完成菜单映射。
```

**示例：**

> 开发「通用生成」页面，放到 `/Users/xmiles/Documents/素材/AI 创作`，取名为 `通用生成.html`，用 `ant-design-skill` 进行设计，并更新 `menu-config.js` 完成菜单映射。

AI 会依次：
1. 调用 `ant-design-skill` 生成符合 Ant Design 规范的页面
2. 将文件保存到指定路径
3. 在 `menu-config.js` 对应模块的 `children` 里加上新菜单项

> **注意**：如果该页面对应的一级菜单还不存在，请同时说明放在哪个一级菜单下（如"放在「AI 创作」模块里"）。

---

## 怎么加一个新页面？（两步搞定）

### 第一步：写页面

在对应的模块文件夹里新建一个 `.html` 文件。比如要在「素材管理」下加一个"标签管理"页面：

1. 在 `素材管理/` 文件夹里新建 `tag.html`
2. 复制下面的模板，改成你的内容

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>标签管理 - 量化投放系统</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                         "PingFang SC", "Microsoft YaHei", sans-serif;
            background-color: #f5f7fa;
            font-size: 14px;
            color: #333;
            padding: 20px;
        }

        :root {
            --primary-color: #4a9eff;
            --primary-hover: #3a8eef;
            --card-bg: #ffffff;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --border-color: #e8e8e8;
        }

        .page-header { margin-bottom: 20px; }
        .page-title { font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
        .page-desc { font-size: 13px; color: var(--text-secondary); }
        .card { background: var(--card-bg); border-radius: 8px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 16px; }
    </style>
</head>
<body>
    <div class="page-header">
        <h1 class="page-title">标签管理</h1>
        <p class="page-desc">管理素材的标签分类</p>
    </div>

    <div class="card">
        <!-- 你的页面内容写在这里 -->
        <p>这是标签管理页面</p>
    </div>
</body>
</html>
```

### 第二步：加到菜单

打开 `menu-config.js`，找到对应的模块，加一行：

```js
// 找到"素材管理"这个模块
{
    id: 'material',
    name: '素材管理',
    children: [
        { name: '素材库',   page: '素材管理/index.html',     icon: '...' },
        { name: '物料库',   page: '素材管理/物料库.html',     icon: '...' },
        { name: '原料库',   page: '素材管理/原料库.html',     icon: '...' },
        { name: '品类管理', page: '素材管理/category.html',   icon: '...' },
        { name: '产品管理', page: '素材管理/product.html',    icon: '...' },
        { name: '标签管理', page: '素材管理/tag.html',        icon: '' },  // ← 加这一行
    ]
}
```

**就这样！** 保存后刷新浏览器就能看到新菜单了。

> icon 可以不填（留空字符串），菜单名称前面就不会有图标。想加图标可以去 [Feather Icons](https://feathericons.com/) 找 SVG 路径。

---

## 写页面时的注意事项

### 必须遵守

| 规则 | 原因 |
|------|------|
| `body` 背景色用 `#f5f7fa` | 和系统框架背景保持一致 |
| `body` 内边距用 `padding: 20px` | 和其他页面间距统一 |
| 不要写导航栏 (`<nav>`, `<header>`) | 框架已经有了，写了会重复 |
| 不要用 `position: fixed` | 会浮在框架上面，遮挡菜单 |
| 不要用 `height: 100vh` | 会超出框架，出现双滚动条 |

### 建议遵守

- 文件名用小写 + 连字符：`tag-manage.html` 而不是 `tagManage.html`
- CSS 类名也用连字符：`.page-header` 而不是 `.pageHeader`
- 页面高度由内容自然撑开，不要给 `body` 设固定高度

---

## menu-config.js 配置说明

```js
const MENU_CONFIG = [
    {
        id: 'material',          // 模块标识（英文，不要改）
        name: '素材管理',         // 顶部菜单栏显示的名称
        children: [              // 侧边栏的二级菜单列表
            {
                name: '素材库',                    // 侧边栏显示的名称
                page: '素材管理/index.html',       // 对应的 HTML 文件路径
                icon: '<rect ...></rect>'          // SVG 图标路径（可选）
            },
            // ...更多菜单项
        ]
    },
    // ...更多模块
];

// 侧边栏底部固定的菜单（如"我的任务"）
const BOTTOM_MENU = [ ... ];

// 打开系统时默认加载的页面
const DEFAULT_PAGE = '首页/index.html';
const DEFAULT_TAB_NAME = '首页';
```

---

## 怎么新增一个模块？

如果需要加一个全新的一级菜单（比如"运营管理"）：

1. 新建文件夹 `运营管理/`
2. 在里面创建页面，比如 `运营管理/index.html`
3. 在 `menu-config.js` 的 `MENU_CONFIG` 数组里加一个新对象：

```js
{
    id: 'operation',
    name: '运营管理',
    children: [
        { name: '运营首页', page: '运营管理/index.html', icon: '' }
    ]
}
```

---

## 页面之间怎么通信？

你的页面运行在 iframe 里。如果需要让框架做一些事情，用 `postMessage`：

```js
// 让框架打开一个新标签页
parent.postMessage({ action: 'openTab', title: '新页面', url: '素材管理/tag.html' }, '*');

// 关闭当前标签页
parent.postMessage({ action: 'closeCurrentTab' }, '*');
```

> 这些功能需要框架层支持，使用前先确认。

---

## 怎么测试？

1. 用浏览器直接打开 `index.html`
2. 点击左侧菜单，看页面能不能正常加载
3. 你也可以直接打开单个页面文件（如 `素材管理/tag.html`）来单独调试

---

## 常见问题

**Q：页面出现双滚动条？**
A：检查是否用了 `height: 100vh` 或 `overflow` 属性，去掉就好。

**Q：页面在框架里显示不完整？**
A：不要给 body 设固定高度，让内容自然撑开。

**Q：可以用 Element UI 等组件库吗？**
A：可以，但要确保不影响框架的样式。

**Q：我在 menu-config.js 里加了页面但菜单没出来？**
A：检查 JS 语法是否正确（比如少了逗号）。浏览器按 F12 打开控制台看有没有报错。

---

**最后更新**：2026-03-31
