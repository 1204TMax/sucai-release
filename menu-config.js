/**
 * 菜单配置文件
 *
 * 所有菜单和页面的对应关系都在这里配置。
 * 新增页面只需要两步：
 *   1. 在对应文件夹里创建 .html 文件
 *   2. 在下面的配置里加一行
 *
 * 结构说明：
 *   - id：模块唯一标识（英文，不要改）
 *   - name：顶部一级菜单显示的名称
 *   - children：二级菜单列表
 *     - name：侧边栏显示的名称
 *     - page：对应的 HTML 文件路径（相对于本文件所在目录）
 *     - icon：菜单图标（SVG 路径）
 *   - shortcuts：快捷入口分组（可选，带独立标题显示在 children 下方）
 */

const MENU_CONFIG = [
  {
    id: 'ai',
    name: 'AI创作',
    children: [
      {
        name: '通用生成',
        page: 'AI 创作/通用生成.html',
        icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
      },
      {
        name: '我的任务',
        page: 'AI 创作/我的任务.html',
        icon: '<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
        badge: { generating: 3, unviewed: 5 }
      },
      {
        name: '项目管理',
        page: 'AI 创作/项目管理.html',
        icon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>'
      }
    ]
  },
  {
    id: 'material',
    name: '素材管理',
    children: []
  },
];

// 默认首页（打开系统时加载的页面）
const DEFAULT_PAGE = 'AI 创作/通用生成.html';
const DEFAULT_TAB_NAME = '通用生成';
