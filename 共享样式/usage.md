# 共享样式使用说明

## 目录分工

- `design-system.md`：视觉规范，定义颜色、间距、圆角、组件规则
- `components.css` / `components.js`：轻量通用组件（当前包括日期范围选择器、图片生成中 loading 占位、图片等待中灰占位）
- `project-picker.css` / `project-picker.js`：项目选择弹窗，单独维护
- `confirm-modal.css` / `confirm-modal.js`：确认弹窗，支持传入标题、文案、按钮文案和回调
- `image-preview.css` / `image-preview.js`：图片预览系统（小图 hover + 放大预览）

## 放置规则

### 放进 `components.*`
适合：
- 轻量组件
- 低耦合组件
- 不依赖特定页面状态的组件
- 比如：日期选择器、图片生成中 loading 占位、图片等待中灰占位

### 单独拆成一对文件
适合：
- 大弹窗 / 大面板
- 跨多个页面复用
- 自带完整交互逻辑
- 容易受页面环境影响
- 比如：`project-picker.*`、`confirm-modal.*`、`image-preview.*`

一句话：

> 小组件进 `components.*`，大弹窗 / 大面板单独成对文件。

## 页面引用方式

### 只用轻量通用组件
```html
<link rel="stylesheet" href="../共享样式/components.css">
<script src="../共享样式/components.js"></script>
```

> 其中 `components.css` 现在除了日期范围选择器，也包含任务卡片缩略图占位样式：
> - `.cc-img-loading-thumb`
> - `.cc-img-loading-spinner`
> - `.cc-img-pending-thumb`

### 页面还要用项目选择弹窗
```html
<link rel="stylesheet" href="../共享样式/components.css">
<link rel="stylesheet" href="../共享样式/project-picker.css">

<script src="../共享样式/components.js"></script>
<script src="../共享样式/project-picker.js"></script>
```

### 页面还要用确认弹窗
```html
<link rel="stylesheet" href="../共享样式/confirm-modal.css">
<script src="../共享样式/confirm-modal.js"></script>
```

调用方式：
```js
openConfirmModal({
  title: '提示',
  description: '确认后将执行当前操作。',
  cancelText: '取消',
  confirmText: '确认',
  onConfirm: function () {
    // 用户确认后的逻辑
  }
})
```

### 页面还要用图片预览
```html
<link rel="stylesheet" href="../共享样式/components.css">
<link rel="stylesheet" href="../共享样式/image-preview.css">

<script src="../共享样式/components.js"></script>
<script src="../共享样式/image-preview.js"></script>
```

### 页面同时使用项目弹窗 + 图片预览
```html
<link rel="stylesheet" href="../共享样式/components.css">
<link rel="stylesheet" href="../共享样式/project-picker.css">
<link rel="stylesheet" href="../共享样式/image-preview.css">

<script src="../共享样式/components.js"></script>
<script src="../共享样式/project-picker.js"></script>
<script src="../共享样式/image-preview.js"></script>
```

## 命名规则

- 共享组件必须带前缀，避免污染页面样式
- 推荐前缀：`cc-`
- 不要直接使用过于通用的类名，例如：
  - `.modal`
  - `.title`
  - `.search`
  - `.date-input`

推荐写法：
- `.cc-proj-modal`
- `.cc-proj-title`
- `.cc-date-input`
- `.cc-img-loading-thumb`
- `.cc-img-loading-spinner`
- `.cc-img-pending-thumb`

## 新增组件时的检查项

新增一个共享组件前，先问 4 个问题：

1. 这个组件会不会被多个页面复用？
2. 它是轻量组件还是重组件？
3. 它是否依赖某个页面特有的状态或布局？
4. 它的类名是否足够隔离，不会污染别的页面？

如果第 1 条是“会”，并且第 2、3 条偏重，就优先单独拆文件。

## 经验专区

### 1. 如果一个共享组件一接到新页面里，样式就明显不对
**先重点检查：**
- 这个组件是不是依赖了页面里才有的变量（比如 `--bg-surface`、`--text-hi`）
- 当前页面有没有这些变量

**建议处理方式：**
- 如果它只是轻量组件，可以继续放共享文件里，但关键样式要补 fallback
- 如果它是重组件（比如弹窗），就单独拆文件，不要继续塞在通用组件里
- 确认弹窗这类带遮罩、按钮文案和确认回调的组件，也按独立弹窗处理，不放入 `components.*`

**真实例子：**
- 项目弹窗合进 `components.*` 之后，到 `通用生成.html` 里样式直接失真
- 原因不是弹窗逻辑坏了，而是页面没有那套 design token
- 后来拆回 `project-picker.css/js`，并给关键样式补 fallback，才稳定下来

### 2. 如果你一合并文件，页面里原本正常的样式突然乱了
**先重点检查：**
- 共享组件是不是用了太普通的类名
- 页面里有没有同名类

**建议处理方式：**
- 共享组件类名统一加前缀，比如 `cc-`
- 不要使用 `.modal`、`.title`、`.search`、`.footer` 这种通用名字

**真实例子：**
- 项目弹窗一开始用了 `.proj-modal`、`.proj-modal-title`
- 合并进共享文件后，把页面原本自己的结构样式直接打乱了
- 后来统一改成 `cc-proj-*`，问题才消失

### 3. 如果你改完共享文件，点击没反应、卡片不显示、页面直接空掉
**先重点检查：**
- 共享函数是不是在页面主渲染之前就已经加载了
- 有没有和页面里的变量 / 函数重名
- 页面原来的调用签名和共享函数现在的签名还兼不兼容

**建议处理方式：**
- 先查原页面怎么调用，再决定怎么抽共享
- 必要时用 adapter 或兼容旧签名，不要直接硬替换
- 发现有重名变量时，优先给共享文件里的变量加前缀

**真实例子：**
- 图片预览接入共享时，`components.js` 加载顺序不对，`thumbOverlayHtml()` 来不及定义，卡片直接不渲染
- 后来又发现共享文件里的变量和页面自己的 `STORAGE_TARGETS` 撞名，脚本继续报错
- 修复顺序就是：先解决加载顺序，再解决变量重名

### 4. 图片 loading 这类样式组件怎么放
**先重点检查：**
- 它是不是只有展示职责，没有页面级状态写回
- 它是不是纯样式或极轻交互
- 它会不会在多个任务流/列表页里复用

**建议处理方式：**
- 如果只是缩略图 loading / 占位这类轻量样式，放进 `components.css`
- 类名必须加共享前缀，比如 `cc-img-loading-*`、`cc-img-pending-*`
- 关键颜色最好走 design token，并给 fallback

**真实例子：**
- `我的任务.html` 里的图片生成中 loading 和等待中灰占位一开始都写在页面内
- 后来确认它们都只是轻量展示组件，没有业务状态逻辑
- 所以抽到了 `components.css`，页面里只保留布局尺寸控制

### 5. 如果一个组件既跨页面复用，又自带一整套交互
**先重点检查：**
- 它到底是“小控件”，还是“完整模块”
- 它是不是已经带了搜索、确认、切换、状态写回、弹层这些完整能力

**建议处理方式：**
- 小控件放 `components.*`
- 完整模块直接单独拆成一对文件

**真实例子：**
- 项目弹窗看起来只是一个弹窗，但其实自带：搜索、左右列表、单选逻辑、确认/取消、状态写回
- 图片预览看起来只是“看图”，但其实自带：小图 hover、放大预览、底部按钮、左右切换、菜单交互
- 这两种都已经不是“小组件”了
- 放在 `components.*` 里只会让依赖越来越乱
- 所以后来分别拆成 `project-picker.css/js` 和 `image-preview.css/js` 才是更稳的做法

## 和 design-system.md 的关系

- `design-system.md` 解决的是：**视觉规范怎么写**
- `usage.md` 解决的是：**共享组件文件怎么组织、怎么引用、怎么新增**

两者不要混在一起。
