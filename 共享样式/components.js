/**
 * 共享组件逻辑
 *
 * 当前仅保留轻量通用组件：日期范围选择器
 * 重组件已独立拆分：
 * - project-picker.css / project-picker.js
 * - image-preview.css / image-preview.js
 */

/**
 * 生成日期选择器下拉菜单 HTML
 * 依赖：state.filters、renderFilterBar()、renderTaskFeed()、toggleFilterDD()、closeFilterDDs()
 */
function buildDatePickerHTML(filters, chevronSvg) {
  var f = filters;
  var dateLabels = {'7':'近 7 天', '30':'近 30 天', '90':'近 90 天', 'custom':'自定义'};

  var dateLabel = f.dateRange === 'custom' && (f.dateStart || f.dateEnd)
    ? (f.dateStart || '起') + ' ~ ' + (f.dateEnd || '止')
    : (dateLabels[f.dateRange] || '日期范围');

  var presetItems = [
    {v: '', l: '全部'}, {v: '7', l: '近 7 天'}, {v: '30', l: '近 30 天'}, {v: '90', l: '近 90 天'}
  ].map(function(o) {
    return '<button class="dropdown-item' + (f.dateRange === o.v ? ' on' : '') + '"'
      + ' onclick="datePickerSelect(\'' + o.v + '\')">' + o.l + '</button>';
  }).join('');

  var customItem = '<div class="date-picker-divider"></div>'
    + '<button class="dropdown-item' + (f.dateRange === 'custom' ? ' on' : '') + '"'
    + ' onclick="datePickerSelect(\'custom\');event.stopPropagation()">自定义</button>';

  var customInputs = '';
  if (f.dateRange === 'custom') {
    customInputs = '<div style="padding:var(--space-2) var(--space-4);display:flex;align-items:center;gap:var(--space-1);">'
      + '<input class="date-input" type="date" value="' + escHtml(f.dateStart || '') + '"'
      + ' onchange="datePickerSetCustom(\'start\',this.value)" onclick="event.stopPropagation()">'
      + '<span class="date-dash">—</span>'
      + '<input class="date-input" type="date" value="' + escHtml(f.dateEnd || '') + '"'
      + ' onchange="datePickerSetCustom(\'end\',this.value)" onclick="event.stopPropagation()">'
      + '</div>';
  }

  return '<div class="sel-wrap">'
    + '<button class="sel' + (f.dateRange ? ' on' : '') + '"'
    + ' onclick="toggleFilterDD(event,\'dateRange\')">' + escHtml(dateLabel) + ' ' + chevronSvg + '</button>'
    + '<div class="dropdown" id="filterDD-dateRange">' + presetItems + customItem + customInputs + '</div>'
    + '</div>';
}

function datePickerSelect(value) {
  state.filters.dateRange = value;
  if (value !== 'custom') {
    state.filters.dateStart = '';
    state.filters.dateEnd = '';
    closeFilterDDs();
  }
  renderFilterBar();
  renderTaskFeed();
}

function datePickerSetCustom(which, value) {
  if (which === 'start') state.filters.dateStart = value;
  if (which === 'end')   state.filters.dateEnd = value;
  renderFilterBar();
  renderTaskFeed();
}

function datePickerFilter(createdTime, filters) {
  var f = filters;
  if (f.dateRange && f.dateRange !== 'custom') {
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(f.dateRange));
    if (new Date(createdTime) < cutoff) return false;
  }
  if (f.dateRange === 'custom') {
    if (f.dateStart && new Date(createdTime) < new Date(f.dateStart)) return false;
    if (f.dateEnd) {
      var end = new Date(f.dateEnd);
      end.setDate(end.getDate() + 1);
      if (new Date(createdTime) >= end) return false;
    }
  }
  return true;
}
