// 简单配置文件 - 可以直接在这里修改题目和设置
// 修改后刷新页面即可生效

const QUIZ_CONFIG = {
    // 竞赛基本信息
    title: "个人必答题部分",

    // 竞赛规则页面配置
    competitionRules: {
        title: "个人必答题规则",
        rules: [
            "a.每人1题，每队3题，共18 题。每队按照座位顺序由队员依次作答",
            "　每人答题限时20秒，从第一组开始。",
            "b.答对1题加 10分，答错不扣分，超时答题不得分。",
            "c.选手答题时，本组其他队员不得以任何形式提醒或补充，违者此题作废，不予计分，不予补题。"
        ],
        buttonText: "开始答题"
    },

    // 样式配置
    styles: {
        textColor: "#ffffff",      // 文字颜色
        primaryColor: "#2196F3",  // 主要颜色
        successColor: "#4CAF50",  // 成功颜色
        warningColor: "#ff9800",  // 警告颜色
        dangerColor: "#f44336",   // 危险颜色
        background: "assets/background.png" // 背景图片路径
    },

    // 倒计时设置（秒）
    timerDuration: 20,

    // 倒计时是否自动开始（true=自动开始，false=需要手动点击闹钟图标）
    autoStartTimer: false,

    // 题目数据 - 多选题页结构
    questions: [
  {
    "page_title": "第一组答题",
    "questions": [
      {
        "id": 1,
        "question": "1.宪法规定，国家倡导（  ），提倡爱祖国、爱人民、爱劳动、爱科学、爱社会主义的公德。\nA.社会主义核心价值观\nB.集体主义\nC.爱国主义\nD.共产主义",
        "answer": "A"
      },
      {
        "id": 2,
        "question": "2.生产经营单位应当在有较大危险因素的生产经营场所和有关设施、设备上，设置明显的（  ）。\nA.安全宣传标语\nB.安全宣教挂图\nC.安全警示标志\nD.安全合格标志",
        "answer": "C"
      }
    ]
  },
  {
    "page_title": "第二组答题",
    "questions": [
      {
        "id": 1,
        "question": "2.宪法规定，中华人民共和国公民的人格尊严不受侵犯。禁止用任何方法对公民进行侮辱、诽谤和（  ）。\nA.诬告陷害\nB.打击报复\nC.人身攻击\nD.恶意中伤",
        "answer": "A"
      },
      {
        "id": 2,
        "question": "2.招标项目的评标委员会成员人数应为（  ）。\nA.3人及以上单数\nB.5人及以上单数\nC.7人及以上单数\nD.9人及以上单数",
        "answer": "B"
      }
    ]
  }
],

    // 其他设置
    enableSoundEffects: false,
    autoProgress: false,
    shuffleQuestions: false
};

// 配置使用说明：
// 1. 直接修改上面的内容即可更新配置
// 2. 添加题目：在questions数组中添加新对象
// 3. 修改样式：调整styles中的颜色值
// 4. 修改倒计时：调整timerDuration的值
// 5. 倒计时自动开始：设置autoStartTimer为true则自动开始，false则需要手动点击闹钟图标
// 6. 修改完成后保存文件并刷新页面
