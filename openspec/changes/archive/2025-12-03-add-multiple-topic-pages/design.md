# 多选题页数据结构设计

## 目标
支持多个选题页面，每个页面有自己的标题和题目集合。

## 简化的数据结构

### 新的 questions 结构
```javascript
const QUIZ_CONFIG = {
    title: "普法活动-个人必答题部分",

    // 新的数据结构：页面分组的题目
    questions: [
        {
            page_title: "第一组答题",
            questions: [
                {
                    id: 1,
                    question: "中国的首都是哪里？",
                    answer: "北京"
                },
                {
                    id: 2,
                    question: "1 + 1 等于几？",
                    answer: "2"
                }
            ]
        },
        {
            page_title: "第二组答题",
            questions: [
                {
                    id: 1,
                    question: "《红楼梦》的作者是谁？",
                    answer: "曹雪芹"
                },
                {
                    id: 2,
                    question: "太阳系中最大的行星是哪颗？",
                    answer: "木星"
                }
            ]
        },
        {
            page_title: "第三组答题",
            questions: [
                {
                    id: 1,
                    question: "中国的四大名著不包括以下哪部作品？\nA. 西游记\nB. 水浒传\nC. 三国演义\nD. 聊斋志异",
                    answer: "D. 聊斋志异"
                },
                {
                    id: 2,
                    question: "计算机二进制中，1KB等于多少字节？",
                    answer: "1024字节"
                }
            ]
        }
    ],

    // 其他配置保持不变
    timerDuration: 30,
    styles: {
        textColor: "#ffffff",
        primaryColor: "#2196F3",
        background: "assets/background.png"
    }
};
```

## 数据结构说明

### 页面对象结构
```javascript
{
    page_title: string,    // 页面显示标题
    questions: Question[]  // 该页面包含的题目数组
}
```

### 题目对象结构（保持不变）
```javascript
{
    id: number,        // 题目ID
    question: string,  // 题目内容
    answer: string     // 答案内容
}
```

## 配置使用示例

### 基础配置
```javascript
const QUIZ_CONFIG = {
    title: "知识竞赛系统",

    questions: [
        {
            page_title: "基础知识",
            questions: [
                { id: 1, question: "题目1", answer: "答案1" },
                { id: 2, question: "题目2", answer: "答案2" }
            ]
        },
        {
            page_title: "进阶知识",
            questions: [
                { id: 1, question: "题目3", answer: "答案3" },
                { id: 2, question: "题目4", answer: "答案4" }
            ]
        }
    ]
};
```

### 空页面配置
```javascript
const QUIZ_CONFIG = {
    questions: [
        {
            page_title: "第一组",
            questions: []  // 空题目列表
        }
    ]
};
```

## 界面流程

1. **首页** → 点击进入"选题页"
2. **选题页** → 显示所有 `page_title` 作为页面选项
3. **选择页面** → 进入该页面的题目选择网格
4. **题目页** → 显示选中页面的具体题目和倒计时

## 实现要点

- 页面按数组顺序显示
- 每个页面维护独立的答题状态
- 导航栏显示当前页面的 `page_title`
- 返回按钮返回到选题页（显示所有页面选项）

这个设计简单直观，满足多选题页的基本需求。