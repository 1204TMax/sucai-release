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
    id: 'home',
    name: '首页',
    children: [
      {
        name: '首页',
        page: '首页/index.html',
        icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'
      }
    ],
    shortcuts: {
      title: '常用功能',
      items: [
        { name: '大字报裂变', page: 'AI 创作/图像素材衍生工作流.html', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>' },
        { name: '素材库', page: '素材管理/index.html', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle>' },
        { name: 'AI通用生成', page: 'AI 创作/通用生成.html', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>' }
      ]
    }
  },
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
        page: 'AI 创作/生成详情.html',
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
    children: [
      {
        name: '素材库',
        page: '素材管理/index.html',
        icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle>'
      },
      {
        name: '物料库',
        page: '素材管理/物料库.html',
        icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>'
      },
      {
        name: '混剪策略',
        page: '素材管理/混剪策略.html',
        icon: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'
      }
    ]
  },
  {
    id: 'settings',
    name: '系统设置',
    children: [
      {
        name: '模型配置',
        page: '系统设置/模型配置.html',
        icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>'
      },
      {
        name: '算力成本',
        page: '系统设置/算力成本.html',
        icon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
      }
    ]
  }
];

// 默认首页（打开系统时加载的页面）
const DEFAULT_PAGE = '首页/index.html';
const DEFAULT_TAB_NAME = '首页';
