/**
 * 图片预览组件 - 逻辑
 *
 * 包含：
 * - 小图 hover 操作按钮 HTML
 * - 入库 / 编辑菜单交互
 * - 大图预览初始化、打开、切换、关闭
 */

var CC_PREVIEW_STORAGE_TARGETS = ['素材库', '物料库', '原料库'];
var CC_PREVIEW_EDIT_OPTIONS = [
  { l: '文本创作' },
  { l: '图像创作' },
  { l: '视频创作' },
  { l: '工作流', children: ['图片衍生'] }
];

var CC_PREVIEW_ICONS = {
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  store: '<svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M102.4 69.12h819.2l102.4 204.8v716.8h-51.2H0v-716.8l102.4-204.8z m819.2 302.08H102.4v512h819.2v-512z m-22.016-107.52l-50.176-93.184H174.08l-50.176 93.184h775.68z"/><path d="M558.592 632.32h114.688l-153.088 153.088-152.576-153.088h114.688V479.232h76.288v153.088z"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>',
  downloadLg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  storeLg: '<svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M102.4 69.12h819.2l102.4 204.8v716.8h-51.2H0v-716.8l102.4-204.8z m819.2 302.08H102.4v512h819.2v-512z m-22.016-107.52l-50.176-93.184H174.08l-50.176 93.184h775.68z"/><path d="M558.592 632.32h114.688l-153.088 153.088-152.576-153.088h114.688V479.232h76.288v153.088z"/></svg>',
  editLg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
};

function thumbOverlayHtml(url, downloadAction) {
  if (arguments.length === 1) {
    downloadAction = url;
    url = '';
  }
  if (!downloadAction) downloadAction = "event.stopPropagation();showToast('已下载')";

  var storeDD = CC_PREVIEW_STORAGE_TARGETS.map(function(t) {
    return '<div class="storage-dd-item" onclick="event.stopPropagation();showToast(\'已入库到' + t + '\');this.closest(\'.storage-dropdown\').style.display=\'none\'">' + t + '</div>';
  }).join('');

  var editDD = CC_PREVIEW_EDIT_OPTIONS.map(function(opt) {
    if (opt.children) {
      var subs = opt.children.map(function(s) {
        return '<div class="edit-submenu-item" onclick="event.stopPropagation();showToast(\'已添加到' + s + '工作流\');this.closest(\'.edit-menu\').style.display=\'none\'">' + s + '</div>';
      }).join('');
      return '<div class="edit-menu-item" style="position:relative">' + opt.l + ' <span class="sub-arrow">▸</span>'
        + '<div class="edit-submenu">' + subs + '</div></div>';
    }
    return '<div class="edit-menu-item" onclick="event.stopPropagation();showToast(\'已添加到' + opt.l + '\');this.closest(\'.edit-menu\').style.display=\'none\'">' + opt.l + '</div>';
  }).join('');

  return '<div class="thumb-overlay">'
    + '<button class="thumb-act" title="下载" onclick="' + downloadAction + '">' + CC_PREVIEW_ICONS.download + '</button>'
    + '<button class="thumb-act" title="入库" onclick="event.stopPropagation();toggleThumbDD(this,\'store\')">' + CC_PREVIEW_ICONS.store
    + '<div class="storage-dropdown" onclick="event.stopPropagation()">' + storeDD + '</div></button>'
    + '<button class="thumb-act" title="编辑" onclick="event.stopPropagation();toggleThumbDD(this,\'edit\')">' + CC_PREVIEW_ICONS.edit
    + '<div class="edit-menu" onclick="event.stopPropagation()">' + editDD + '</div></button>'
    + '</div>';
}

function toggleThumbDD(btn, type) {
  var dd = btn.querySelector(type === 'store' ? '.storage-dropdown' : '.edit-menu');
  var overlay = btn.closest('.thumb-overlay');
  if (overlay) {
    overlay.querySelectorAll('.storage-dropdown,.edit-menu').forEach(function(el) {
      if (el !== dd) el.style.display = 'none';
    });
  }
  dd.style.display = dd.style.display === 'none' ? '' : 'none';
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.thumb-act')) {
    document.querySelectorAll('.thumb-overlay .storage-dropdown,.thumb-overlay .edit-menu').forEach(function(el) {
      el.style.display = 'none';
    });
  }
});

var _ccPvList = [];
var _ccPvIdx = 0;
var _ccPvType = 'image';

function initImagePreview() {
  if (document.getElementById('imgPreviewMask')) return;

  var storeItems = CC_PREVIEW_STORAGE_TARGETS.map(function(t) {
    return '<div class="pv-dd-item" onclick="showToast(\'已入库到' + t + '\');this.closest(\'.img-preview-store-dd\').classList.remove(\'show\')">' + t + '</div>';
  }).join('');

  var editItems = CC_PREVIEW_EDIT_OPTIONS.map(function(opt) {
    if (opt.children) {
      var subs = opt.children.map(function(s) {
        return '<div class="pv-dd-item" onclick="showToast(\'已添加到' + s + '工作流\');this.closest(\'.img-preview-store-dd\').classList.remove(\'show\')">' + s + '</div>';
      }).join('');
      return '<div class="pv-dd-item">' + opt.l + ' <span class="sub-arrow">▸</span><div class="pv-dd-sub">' + subs + '</div></div>';
    }
    return '<div class="pv-dd-item" onclick="showToast(\'已添加到' + opt.l + '\');this.closest(\'.img-preview-store-dd\').classList.remove(\'show\')">' + opt.l + '</div>';
  }).join('');

  var html = '<div class="img-preview-mask" id="imgPreviewMask" onclick="closeImagePreview()">'
    + '<img class="img-preview-img" id="imgPreviewImg" src="" alt="" onclick="event.stopPropagation()">'
    + '<video class="img-preview-video" id="imgPreviewVideo" controls playsinline preload="metadata" onclick="event.stopPropagation()"></video>'
    + '<div class="img-preview-bar" onclick="event.stopPropagation()">'
    +   '<button title="关闭" onclick="closeImagePreview()">' + CC_PREVIEW_ICONS.close + '</button>'
    +   '<button title="下载" onclick="pvDownload()">' + CC_PREVIEW_ICONS.downloadLg + '</button>'
    +   '<div class="img-preview-store-wrap">'
    +     '<button title="入库" onclick="pvToggleDD(this)">' + CC_PREVIEW_ICONS.storeLg + '</button>'
    +     '<div class="img-preview-store-dd" onclick="event.stopPropagation()">' + storeItems + '</div>'
    +   '</div>'
    +   '<div class="img-preview-store-wrap">'
    +     '<button title="编辑" onclick="pvToggleDD(this)">' + CC_PREVIEW_ICONS.editLg + '</button>'
    +     '<div class="img-preview-store-dd" onclick="event.stopPropagation()">' + editItems + '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="img-preview-nav" onclick="event.stopPropagation()">'
    +   '<button id="pvPrev" onclick="pvNav(-1)">' + CC_PREVIEW_ICONS.prev + '</button>'
    +   '<button id="pvNext" onclick="pvNav(1)">' + CC_PREVIEW_ICONS.next + '</button>'
    + '</div>'
    + '</div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

window.__previewImage = function(url, list, idx) {
  pvOpen({ type:'image', url:url, list:list, idx:idx });
};

window.__previewMedia = function(media, list, idx) {
  if (!media) return;
  if (typeof media === 'string') return pvOpen({ type:'image', url:media, list:list, idx:idx });
  pvOpen({ type:media.type || 'image', url:media.url, list:list, idx:idx, duration:media.duration });
};

function pvOpen(media) {
  var mask = document.getElementById('imgPreviewMask');
  var img = document.getElementById('imgPreviewImg');
  var video = document.getElementById('imgPreviewVideo');
  if (!mask || !img || !video || !media || !media.url) return;
  _ccPvList = media.list || [media];
  _ccPvIdx = typeof media.idx === 'number' ? media.idx : 0;
  _ccPvType = media.type || 'image';

  if (_ccPvType === 'video') {
    img.style.display = 'none';
    img.removeAttribute('src');
    video.style.display = 'block';
    if (video.getAttribute('src') !== media.url) {
      video.setAttribute('src', media.url);
      video.load();
    }
    video.controls = true;
  } else {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.style.display = 'none';
    img.style.display = 'block';
    img.src = media.url;
  }

  mask.classList.add('show');
  pvUpdateNav();
}

function closeImagePreview() {
  var mask = document.getElementById('imgPreviewMask');
  var video = document.getElementById('imgPreviewVideo');
  if (mask) {
    mask.classList.remove('show');
    mask.querySelectorAll('.img-preview-store-dd.show').forEach(function(el) { el.classList.remove('show'); });
  }
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

}

function pvNav(dir) {
  var next = _ccPvIdx + dir;
  if (next < 0 || next >= _ccPvList.length) return;
  _ccPvIdx = next;
  var media = _ccPvList[_ccPvIdx];
  if (typeof media === 'string') media = { type:'image', url:media };
  pvOpen({ type:media.type || 'image', url:media.url, list:_ccPvList, idx:_ccPvIdx, duration:media.duration });
}

function pvUpdateNav() {
  var prev = document.getElementById('pvPrev');
  var next = document.getElementById('pvNext');
  if (prev) prev.disabled = _ccPvIdx <= 0;
  if (next) next.disabled = _ccPvIdx >= _ccPvList.length - 1;
}

function pvDownload() {
  var node = _ccPvType === 'video' ? document.getElementById('imgPreviewVideo') : document.getElementById('imgPreviewImg');
  if (!node || !node.src) return;
  var a = document.createElement('a');
  a.href = node.src;
  a.download = _ccPvType === 'video' ? 'download.mp4' : 'download.png';
  a.click();
}

function pvToggleDD(btn) {
  var bar = btn.closest('.img-preview-bar');
  var dd = btn.parentElement.querySelector('.img-preview-store-dd');
  if (bar) {
    bar.querySelectorAll('.img-preview-store-dd.show').forEach(function(el) {
      if (el !== dd) el.classList.remove('show');
    });
  }
  dd.classList.toggle('show');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeImagePreview();
});
