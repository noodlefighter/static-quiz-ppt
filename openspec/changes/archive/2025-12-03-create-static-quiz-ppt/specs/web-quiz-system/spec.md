# 知识竞赛系统规范

## ADDED Requirements

### Requirement: 静态网页PPT系统
系统SHALL提供纯静态的网页PPT，可以在本地浏览器中直接打开，无需服务器环境。

#### Scenario: 用户打开PPT
- **WHEN** 用户在浏览器中打开index.html文件
- **THEN** 系统SHALL显示知识竞赛首页

#### Scenario: 用户点击首页空白区域
- **WHEN** 用户点击首页空白区域时
- **THEN** 系统SHALL跳转到选题页

### Requirement: 选题页功能
选题页SHALL展示所有题目序号，已选和未选的题目使用不同颜色区分。

#### Scenario: 用户浏览选题页
- **WHEN** 用户进入选题页时
- **THEN** 系统SHALL显示题目序号网格，已选题目用一种颜色，未选题目用另一种颜色

#### Scenario: 用户点击题目序号
- **WHEN** 用户点击任意题目序号时
- **THEN** 系统SHALL跳转到对应的题目页面

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
系统SHALL支持通过JSON文件配置竞赛题目、背景图和文字颜色。

#### Scenario: 用户修改JSON配置文件
- **WHEN** 用户修改JSON配置文件中的题目数据时
- **THEN** 系统SHALL在下一次加载时应用新的题目数据

#### Scenario: 用户修改样式配置
- **WHEN** 用户修改JSON配置文件中的背景图路径或文字颜色时
- **THEN** 系统SHALL在下一次加载时应用新的样式配置