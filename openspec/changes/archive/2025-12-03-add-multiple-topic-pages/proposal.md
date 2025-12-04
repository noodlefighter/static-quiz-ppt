## Why
当前系统只支持单一的选题页，无法满足需要多个题组或分类的竞赛需求。用户希望能够创建多个选题页，每个选题页有自己的标题和题目集合，并在导航栏中提供快速切换功能。

当前配置文件（simple-config.js）已经包含了多个`page_title`字段，但系统仍使用单一的选题页。需要删除当前的单一选题页（id="topicsPage"），并根据`questions`数组中的各个`page_title`动态创建多个独立的选题页。

## What Changes
- **删除现有的单一选题页**: 移除HTML中固定的`<div id="topicsPage">`元素
- **动态创建多个选题页**: 根据配置文件中`questions`数组的每个`page_title`动态生成独立的选题页
- **修改导航栏**: 将单一的"选题页"按钮替换为动态生成的多个选题页切换按钮
- **增强页面状态管理**: 支持多个选题页的独立状态管理
- **更新JavaScript逻辑**: 修改页面初始化和导航逻辑以处理多选题页场景
- **保持questions数据结构**: 当前questions数组结构已经满足需求，包含page_title和questions字段

## Impact
- **Affected specs**: web-quiz-system（功能扩展）
- **Affected code**:
  - 配置文件格式 (config.json)
  - 导航栏组件 (index.html, js/navigation.js)
  - 选题页逻辑 (js/topic-page.js)
  - 状态管理 (js/state-manager.js)