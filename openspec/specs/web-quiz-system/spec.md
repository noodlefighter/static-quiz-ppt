# web-quiz-system Specification

## Purpose
TBD - created by archiving change create-static-quiz-ppt. Update Purpose after archive.
## Requirements
### Requirement: 静态网页PPT系统
系统SHALL提供纯静态的网页PPT，可以在本地浏览器中直接打开，无需服务器环境。

#### Scenario: 用户打开PPT
- **WHEN** 用户在浏览器中打开index.html文件
- **THEN** 系统SHALL显示知识竞赛首页

#### Scenario: 用户点击首页空白区域
- **WHEN** 用户点击首页空白区域时
- **THEN** 系统SHALL跳转到选题页

### Requirement: 选题页功能
系统SHALL支持多页面选择功能，从原有的单一题目网格升级为页面选择界面，然后进入具体页面的题目网格。

#### Scenario: 页面选择界面
- **WHEN** 用户进入选题页时
- **THEN** 系统SHALL显示所有 `page_title` 作为页面选项
- **AND** 每个页面选项显示该页面的题目数量和完成进度
- **AND** 页面选项按配置文件中的数组顺序显示

#### Scenario: 页面内题目选择
- **WHEN** 用户点击页面标题时
- **THEN** 系统SHALL跳转到该页面的题目选择网格
- **AND** 题目网格仅显示该页面下的题目
- **AND** 导航栏显示当前页面的 `page_title`
- **AND** 题目状态仅反映当前页面的答题情况

### Requirement: 题目页功能
题目页SHALL显示题目内容，并包含30秒倒计时和显示答案功能。

#### Scenario: 用户查看题目
- **WHEN** 用户进入题目页时
- **THEN** 系统SHALL显示题目内容和30秒倒计时

#### Scenario: 倒计时进行中
- **WHEN** 倒计时开始后
- **THEN** 系统SHALL实时显示剩余时间
- **AND** 当时间到0时颜色变红

#### Scenario: 用户点击显示答案
- **WHEN** 用户点击"显示答案"按钮时
- **THEN** 系统SHALL显示题目的答案

### Requirement: 导航条功能
导航条SHALL包含全屏按钮、返回首页按钮、返回选题页按钮。

#### Scenario: 用户点击全屏按钮
- **WHEN** 用户点击全屏按钮时
- **THEN** 系统SHALL切换到全屏模式

#### Scenario: 用户点击返回首页按钮
- **WHEN** 用户点击返回首页按钮时
- **THEN** 系统SHALL跳转到首页

#### Scenario: 用户点击返回选题页按钮
- **WHEN** 用户点击返回选题页按钮时
- **THEN** 系统SHALL跳转到选题页

### Requirement: 配置系统
系统SHALL支持页面分组的题目配置结构，将原有的扁平化题目数组替换为包含页面标题和子题目的嵌套结构。

#### Scenario: 配置文件解析
- **WHEN** 系统加载配置文件时
- **THEN** 系统SHALL读取新的 questions 数组结构
- **AND** 每个数组元素必须包含 `page_title` 和 `questions` 字段
- **AND** 系统SHALL验证每个页面的题目数组格式正确性

### Requirement: 多选题页配置系统
系统SHALL支持页面分组的题目配置，允许用户创建多个选题页面，每个页面有自己的标题和题目集合。

#### Scenario: 用户配置多个选题页
- **WHEN** 用户在配置文件中定义包含 `page_title` 和 `questions` 的数组结构时
- **THEN** 系统SHALL在选题页显示所有页面的标题作为选项
- **AND** 用户SHALL能够点击任意页面标题进入该页面的题目选择界面

#### Scenario: 页面标题显示
- **WHEN** 用户进入选题页时
- **THEN** 系统SHALL显示所有配置的 `page_title` 作为可点击的页面选项
- **AND** 每个页面选项SHALL显示该页面的题目数量统计
- **AND** 页面选项按配置文件中的数组顺序排列

### Requirement: 页面内题目管理
系统SHALL为每个选题页面维护独立的题目集合和答题状态。

#### Scenario: 用户进入具体选题页
- **WHEN** 用户点击某个页面标题时
- **THEN** 系统SHALL跳转到该页面的题目选择网格
- **AND** 题目网格显示该页面下的所有题目编号
- **AND** 题目状态区分已答和未答状态
- **AND** 导航栏显示当前页面的 `page_title`

#### Scenario: 页面内题目答题
- **WHEN** 用户在页面内点击题目编号时
- **THEN** 系统SHALL显示该页面下的具体题目内容
- **AND** 倒计时和答题功能正常工作
- **AND** 答题状态仅影响当前页面的进度统计

### Requirement: 页面间导航系统
系统SHALL支持用户在多个选题页面间进行导航和切换。

#### Scenario: 返回页面选择
- **WHEN** 用户在具体题目页面点击返回按钮时
- **THEN** 系统SHALL返回到页面选择界面
- **AND** 保持所有页面的答题状态
- **AND** 页面选项显示最新的进度统计

#### Scenario: 切换到其他页面
- **WHEN** 用户在页面选择界面点击不同页面时
- **THEN** 系统SHALL跳转到新选择页面的题目界面
- **AND** 保持其他页面的答题状态不变
- **AND** 更新导航栏显示新页面的 `page_title`

