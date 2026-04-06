/**
 * 项目选择弹窗组件 - 逻辑
 *
 * 依赖：
 *   - 页面需定义 PROJECT_TREE
 *   - 页面需定义 escHtml(str)
 *   - 页面需在加载后调用 setProjectPickerAdapter({ getValue, setValue, refresh })
 */

var _projSelected = '';
var _projActiveCat = '';
var _projDefaultLogo = window.PROJECT_PICKER_DEFAULT_LOGO || '../icon/xmiles.png';
var _projPickerAdapter = {
  getValue: function() { return ''; },
  setValue: function() {},
  refresh: function() {}
};

function setProjectPickerAdapter(adapter) {
  _projPickerAdapter = Object.assign({}, _projPickerAdapter, adapter || {});
}

function openProjModal() {
  _projSelected = _projPickerAdapter.getValue() || '';
  _projActiveCat = '';
  PROJECT_TREE.forEach(function(g) {
    if (g.name === _projSelected) _projActiveCat = g.name;
    g.children.forEach(function(c) { if (c === _projSelected) _projActiveCat = g.name; });
  });
  if (!_projActiveCat && PROJECT_TREE.length) _projActiveCat = PROJECT_TREE[0].name;
  document.getElementById('ccProjSearchInput').value = '';
  renderProjModalBody();
  document.getElementById('ccProjModalMask').classList.add('show');
}

function closeProjModal() {
  document.getElementById('ccProjModalMask').classList.remove('show');
}

function confirmProjSelect() {
  _projPickerAdapter.setValue(_projSelected);
  closeProjModal();
  _projPickerAdapter.refresh();
}

function projSelectItem(value) {
  _projSelected = (_projSelected === value) ? '' : value;
  renderProjModalBody();
}

function projClickCat(catName) {
  _projActiveCat = catName;
  renderProjModalBody();
}

function renderProjModalBody() {
  var search = (document.getElementById('ccProjSearchInput').value || '').trim().toLowerCase();

  var filteredTree = PROJECT_TREE.map(function(g) {
    var catMatch = !search || g.name.toLowerCase().indexOf(search) >= 0;
    var filteredChildren = g.children.filter(function(c) {
      return !search || c.toLowerCase().indexOf(search) >= 0;
    });
    if (catMatch || filteredChildren.length > 0) {
      return { name: g.name, children: catMatch ? g.children : filteredChildren };
    }
    return null;
  }).filter(Boolean);

  var catNames = filteredTree.map(function(g){ return g.name; });
  if (catNames.indexOf(_projActiveCat) < 0) _projActiveCat = catNames[0] || '';

  var catHtml = filteredTree.map(function(g) {
    var isActive = g.name === _projActiveCat;
    var isSelected = g.name === _projSelected;
    return '<div class="cc-proj-cat-item'+(isActive?' active':'')+(isSelected?' checked':'')+'" onclick="projSelectItem(\''+escHtml(g.name)+'\');projClickCat(\''+escHtml(g.name)+'\')">'
      +'<span class="cc-proj-cat-radio'+(isSelected?' selected':'')+'"></span>'
      +'<span style="flex:1">'+escHtml(g.name)+'</span>'
      +'</div>';
  }).join('');

  var activeCatData = filteredTree.find(function(g){ return g.name === _projActiveCat; });
  var prodHtml = '';
  if (activeCatData && activeCatData.children.length > 0) {
    prodHtml = activeCatData.children.map(function(c) {
      var isSelected = c === _projSelected;
      return '<div class="cc-proj-prod-item'+(isSelected?' selected':'')+'" onclick="projSelectItem(\''+escHtml(c)+'\')">'
        +'<span class="cc-proj-cat-radio'+(isSelected?' selected':'')+'"></span>'
        +'<img class="cc-proj-prod-logo" src="'+escHtml(_projDefaultLogo)+'" alt="">'
        +'<span class="cc-proj-prod-name">'+escHtml(c)+'</span>'
        +'</div>';
    }).join('');
  } else {
    prodHtml = '<div class="cc-proj-modal-empty">该品类下暂无产品</div>';
  }

  document.getElementById('ccProjCatList').innerHTML = catHtml;
  document.getElementById('ccProjProdList').innerHTML = prodHtml;
}
