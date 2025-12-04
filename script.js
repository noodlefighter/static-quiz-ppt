// 知识竞赛系统脚本
class QuizSystem {
    constructor() {
        this.config = null;
        this.questionsData = []; // 存储多个选题页的数据
        this.currentQuestions = []; // 当前选题页的题目
        this.currentQuestionIndex = 0;
        this.answeredQuestions = new Set();
        this.timerInterval = null;
        this.timeLeft = 0;
        this.timerStarted = false; // 计时器是否已开始
        this.currentPage = 'home';
        this.currentTopicIndex = 0; // 当前选题页索引
        this.topicPages = new Map(); // 存储动态生成的选题页元素

        // 初始化
        this.loadConfig();
        this.bindEvents();
    }

    // 加载配置文件
    loadConfig() {
        try {
            // 使用外部配置文件，如果没有则使用默认配置
            if (typeof QUIZ_CONFIG !== 'undefined') {
                this.config = this.parseExternalConfig(QUIZ_CONFIG);
            } else {
                this.config = this.getDefaultConfig();
            }

            this.questionsData = this.config.questions || [];
            this.applyConfig();
            this.hideLoading();
        } catch (error) {
            console.error('配置加载失败:', error);
            this.showErrorMessage('配置加载失败，使用默认配置');
            // 使用默认配置
            this.config = this.getDefaultConfig();
            this.questionsData = this.config.questions || [];
            this.applyConfig();
            this.hideLoading();
        }
    }

    // 解析外部配置
    parseExternalConfig(externalConfig) {
        return {
            quiz: {
                title: externalConfig.title || "知识竞赛系统",
                background: externalConfig.styles?.background || "assets/background.png",
                textColor: externalConfig.styles?.textColor || "#ffffff",
                primaryColor: externalConfig.styles?.primaryColor || "#2196F3",
                successColor: externalConfig.styles?.successColor || "#4CAF50",
                warningColor: externalConfig.styles?.warningColor || "#ff9800",
                dangerColor: externalConfig.styles?.dangerColor || "#f44336"
            },
            questions: externalConfig.questions || [],
            competitionRules: externalConfig.competitionRules || null,
            settings: {
                timerDuration: externalConfig.timerDuration || 30,
                autoStartTimer: externalConfig.autoStartTimer || false,
                showCategories: externalConfig.showCategories !== false,
                enableSoundEffects: externalConfig.enableSoundEffects || false,
                autoProgress: externalConfig.autoProgress || false,
                shuffleQuestions: externalConfig.shuffleQuestions || false
            }
        };
    }

    // 获取默认配置
    getDefaultConfig() {
        return {
            quiz: {
                title: "知识竞赛系统",
                background: "assets/background.png",
                textColor: "#ffffff",
                primaryColor: "#2196F3",
                successColor: "#4CAF50",
                warningColor: "#ff9800",
                dangerColor: "#f44336"
            },
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
                },
                {
                    id: 3,
                    question: "《红楼梦》的作者是谁？",
                    answer: "曹雪芹"
                }
            ],
            settings: {
                timerDuration: 30,
                autoStartTimer: false,
                showCategories: true,
                enableSoundEffects: false,
                autoProgress: false,
                shuffleQuestions: false
            }
        };
    }

    // 应用配置
    applyConfig() {
        if (!this.config) return;

        // 应用主题颜色
        const root = document.documentElement;
        if (this.config.quiz.textColor) {
            root.style.setProperty('--text-color', this.config.quiz.textColor);
        }
        if (this.config.quiz.primaryColor) {
            root.style.setProperty('--primary-color', this.config.quiz.primaryColor);
        }
        if (this.config.quiz.successColor) {
            root.style.setProperty('--success-color', this.config.quiz.successColor);
        }
        if (this.config.quiz.warningColor) {
            root.style.setProperty('--warning-color', this.config.quiz.warningColor);
        }
        if (this.config.quiz.dangerColor) {
            root.style.setProperty('--danger-color', this.config.quiz.dangerColor);
        }

        // 应用背景图片
        if (this.config.quiz.background) {
            document.body.style.backgroundImage = `url('${this.config.quiz.background}')`;
        }

        // 更新标题
        const title = this.config.quiz.title || '知识竞赛系统';
        document.title = title;

        // 更新首页主标题
        const mainTitle = document.getElementById('mainTitle');
        if (mainTitle) {
            mainTitle.textContent = title;
        }

        // 应用设置
        if (this.config.settings) {
            this.settings = {
                timerDuration: this.config.settings.timerDuration || 30,
                autoStartTimer: this.config.settings.autoStartTimer || false,
                showCategories: this.config.settings.showCategories !== false,
                enableSoundEffects: this.config.settings.enableSoundEffects || false,
                autoProgress: this.config.settings.autoProgress || false,
                shuffleQuestions: this.config.settings.shuffleQuestions || false
            };
        } else {
            this.settings = {
                timerDuration: 30,
                autoStartTimer: false,
                showCategories: true,
                enableSoundEffects: false,
                autoProgress: false,
                shuffleQuestions: false
            };
        }

        // 如果设置中要求打乱题目顺序
        if (this.settings.shuffleQuestions) {
            this.shuffleQuestions();
        }

        // 初始化多个选题页
        this.initializeMultipleTopics();
    }

    // 初始化多个选题页
    initializeMultipleTopics() {
        // 创建选题页按钮
        this.createTopicsButtons();

        // 创建多个选题页
        this.createTopicsPages();

        // 如果有选题页数据，默认选择第一个
        if (this.questionsData.length > 0) {
            this.currentTopicIndex = 0;
            this.currentQuestions = this.questionsData[0].questions || [];
        }
    }

    // 创建选题页按钮
    createTopicsButtons() {
        const container = document.getElementById('topicsButtonsContainer');
        if (!container) return;

        container.innerHTML = ''; // 清空容器

        this.questionsData.forEach((topicData, index) => {
            const button = document.createElement('button');
            button.className = 'nav-btn topic-nav-btn';
            button.id = `topicBtn_${index}`;
            button.title = `切换到${topicData.page_title}`;
            button.textContent = `📋 ${topicData.page_title}`;

            button.addEventListener('click', () => {
                this.showTopicsPage(index);
            });

            container.appendChild(button);
        });
    }

    // 创建多个选题页
    createTopicsPages() {
        const container = document.getElementById('topicsContainer');
        if (!container) return;

        container.innerHTML = ''; // 清空容器

        this.questionsData.forEach((topicData, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page hidden';
            pageDiv.id = `topicsPage_${index}`;

            pageDiv.innerHTML = `
                <div class="topics-container">
                    <div class="topics-header">
                        <h2>${topicData.page_title}</h2>
                    </div>
                    <div class="topics-grid" id="topicsGrid_${index}">
                        <!-- 题目网格将通过JavaScript动态生成 -->
                    </div>
                </div>
            `;

            container.appendChild(pageDiv);
            this.topicPages.set(index, pageDiv);

            // 渲染该选题页的题目网格
            this.renderTopicsGridForTopic(index, topicData.questions || []);
        });
    }

    // 为特定选题页渲染题目网格
    renderTopicsGridForTopic(topicIndex, questions) {
        const topicsGrid = document.getElementById(`topicsGrid_${topicIndex}`);
        if (!topicsGrid) return;

        topicsGrid.innerHTML = '';

        questions.forEach((question) => {
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.dataset.questionId = question.id;
            button.dataset.topicIndex = topicIndex; // 添加选题页索引

            // 添加题目编号
            const questionNumber = document.createElement('div');
            questionNumber.className = 'question-number';
            questionNumber.textContent = question.id;
            button.appendChild(questionNumber);

            // 添加分类标签（如果存在）
            if (question.category) {
                const categoryLabel = document.createElement('div');
                categoryLabel.className = 'question-category';
                categoryLabel.textContent = question.category;
                button.appendChild(categoryLabel);
            }

            topicsGrid.appendChild(button);
        });

      }


    // 打乱题目顺序
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    // 绑定事件
    bindEvents() {
        // 首页点击事件 - 修改为跳转到规则页面
        const homePage = document.getElementById('homePage');
        if (homePage) {
            homePage.addEventListener('click', () => this.showRulesPage()); // 跳转到规则页面
        }

        // 竞赛规则按钮事件
        const rulesBtn = document.getElementById('rulesBtn');
        if (rulesBtn) {
            rulesBtn.addEventListener('click', () => this.showRulesPage());
        }

        // 从规则页面开始答题按钮事件
        const startFromRulesBtn = document.getElementById('startFromRulesBtn');
        if (startFromRulesBtn) {
            startFromRulesBtn.addEventListener('click', () => this.showTopicsPage(0));
        }

        // 题目跳转事件 - 更新以支持多选题页
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('topic-btn')) {
                const questionId = parseInt(e.target.dataset.questionId);
                const topicIndex = parseInt(e.target.dataset.topicIndex);
                this.showQuestion(questionId, topicIndex);
            }
        });

        // 答案显示按钮
        const showAnswerBtn = document.getElementById('showAnswerBtn');
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => this.showAnswer());
        }

        // 返回选题按钮
        const backToTopicsBtn = document.getElementById('backToTopicsBtn');
        if (backToTopicsBtn) {
            backToTopicsBtn.addEventListener('click', () => this.backToTopics());
        }

        // 下一题按钮
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // 导航按钮
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.showHomePage());
        }


        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // 计时器点击事件
        const timer = document.getElementById('timer');
        if (timer) {
            timer.addEventListener('click', () => this.handleTimerClick());
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }


    // 显示题目
    showQuestion(questionId, topicIndex = null) {
        let question;
        let topicData;

        if (topicIndex !== null) {
            // 从指定的选题页查找题目
            topicData = this.questionsData[topicIndex];
            if (!topicData) return;
            question = topicData.questions.find(q => q.id === questionId);
            if (!question) return;

            this.currentTopicIndex = topicIndex;
            this.currentQuestions = topicData.questions;
            this.currentQuestionIndex = this.currentQuestions.findIndex(q => q.id === questionId);
        } else {
            // 在当前选题页中查找题目
            question = this.currentQuestions.find(q => q.id === questionId);
            if (!question) return;

            this.currentQuestionIndex = this.currentQuestions.findIndex(q => q.id === questionId);
        }

        // 重置计时器状态
        this.timeLeft = this.settings.timerDuration || 30;
        this.timerStarted = false; // 重置为未开始状态

        // 重置计时器显示
        const timerValue = document.getElementById('timerValue');
        const timerIcon = document.getElementById('timerIcon');
        const timerUnit = document.getElementById('timerUnit');
        const timerElement = document.getElementById('timer');

        if (timerValue) {
            timerValue.textContent = this.timeLeft;
        }

        // 重置计时器显示状态：显示闹钟图标，隐藏数字
        if (timerElement) {
            timerElement.className = 'timer'; // 移除所有警告颜色类和running类
            timerElement.title = '点此开始倒计时'; // 重置提示文字
        }

        if (timerIcon) {
            timerIcon.style.display = 'inline';
        }

        if (timerValue) {
            timerValue.classList.add('hidden');
        }

        if (timerUnit) {
            timerUnit.classList.add('hidden');
        }

        // 更新题目编号
        const questionNumber = document.getElementById('questionNumber');
        if (questionNumber) {
            questionNumber.textContent = `第 ${questionId} 题`;
        }

        // 更新题目内容
        const questionText = document.getElementById('questionText');
        if (questionText) {
            questionText.innerHTML = question.question.replace(/\n/g, '<br>');
        }

        // 隐藏答案
        const answerContainer = document.getElementById('answerContainer');
        if (answerContainer) {
            answerContainer.classList.add('hidden');
        }

        // 更新答案文本
        const answerText = document.getElementById('answerText');
        if (answerText) {
            answerText.textContent = question.answer;
        }

        // 显示题目页
        this.showQuestionPage();

        // 根据配置决定是否自动开始计时
        if (this.settings.autoStartTimer) {
            // 自动启动计时器
            this.startTimer();
        }
        // 如果不自动启动，则显示闹钟图标等待用户点击

        // 标记当前题目
        this.highlightCurrentQuestion(questionId);
    }

    // 高亮当前题目
    highlightCurrentQuestion(questionId) {
        // 移除所有高亮
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.classList.remove('current');
        });

        // 只有在题目页时才高亮当前题目为蓝色，在选题页时不高亮
        if (this.currentPage === 'question') {
            // 同时使用questionId和topicIndex来精确定位当前选题页中的题目按钮
            const currentBtn = document.querySelector(`[data-question-id="${questionId}"][data-topic-index="${this.currentTopicIndex}"]`);
            if (currentBtn) {
                currentBtn.classList.add('current');
            }
        }
    }

    // 显示答案
    showAnswer() {
        const answerContainer = document.getElementById('answerContainer');
        const nextBtn = document.getElementById('nextBtn');

        if (answerContainer) {
            answerContainer.classList.remove('hidden');
        }

        if (nextBtn && !nextBtn.classList.contains('hidden')) {
            nextBtn.classList.remove('hidden');
        }

        // 标记为已答题
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        if (currentQuestion) {
            this.answeredQuestions.add(currentQuestion.id);
            this.markQuestionAsAnswered(currentQuestion.id);
        }

        // 停止计时器
        this.stopTimer();
    }

    // 标记题目为已答题
    markQuestionAsAnswered(questionId) {
        // 同时使用questionId和topicIndex来精确定位当前选题页中的题目按钮
        const button = document.querySelector(`[data-question-id="${questionId}"][data-topic-index="${this.currentTopicIndex}"]`);
        if (button) {
            button.classList.add('answered');
        }
    }

    // 返回选题页
    backToTopics() {
        // 停止计时器
        this.stopTimer();

        // 返回到当前选题页
        this.showTopicsPage(this.currentTopicIndex);
    }

    // 下一题
    nextQuestion() {
        const nextIndex = (this.currentQuestionIndex + 1) % this.currentQuestions.length;
        const nextQuestion = this.currentQuestions[nextIndex];

        if (nextQuestion) {
            this.showQuestion(nextQuestion.id, this.currentTopicIndex);
        }
    }

    // 处理计时器点击事件
    handleTimerClick() {
        if (!this.timerStarted) {
            this.startTimer();
        }
    }

    // 开始计时器
    startTimer() {
        if (this.timerStarted) return; // 如果已经开始了，不重复启动

        this.stopTimer();
        this.timerStarted = true;
        this.timeLeft = this.settings.timerDuration;

        // 切换显示状态：隐藏闹钟图标，显示数字
        const timerElement = document.getElementById('timer');
        const timerIcon = document.getElementById('timerIcon');
        const timerValue = document.getElementById('timerValue');
        const timerUnit = document.getElementById('timerUnit');

        if (timerElement) {
            timerElement.classList.add('running');
            timerElement.title = '计时进行中...'; // 更新提示文字
        }

        if (timerIcon) {
            timerIcon.style.display = 'none';
        }

        if (timerValue) {
            timerValue.classList.remove('hidden');
        }

        if (timerUnit) {
            timerUnit.classList.remove('hidden');
        }

        // 立即显示初始时间，然后开始倒计时
        this.updateTimer();

        this.timerInterval = setInterval(() => {
            this.timeLeft--; // 先减少时间
            this.updateTimer();

            if (this.timeLeft <= 0) {
                this.stopTimer(); // 停止计时器
                // 不自动显示答案，用户需要点击"显示答案"按钮
                if (this.settings.autoProgress) {
                    // 如果设置了自动进度，等待一段时间后进入下一题
                    setTimeout(() => this.nextQuestion(), 2000);
                }
            }
        }, 1000);
    }

    // 更新计时器
    updateTimer() {
        const timerValue = document.getElementById('timerValue');
        const timerElement = document.getElementById('timer');

        if (timerValue) {
            if (this.timeLeft >= 0) {
                timerValue.textContent = this.timeLeft;
            } else {
                timerValue.textContent = '0';
            }
        }

        if (timerElement) {
            // 根据剩余时间改变颜色
            timerElement.className = 'timer';
            if (this.timeLeft <= 5 && this.timeLeft >= 0) {
                timerElement.classList.add('danger');
            } else if (this.timeLeft <= 10 && this.timeLeft > 5) {
                timerElement.classList.add('warning');
            }
        }
    }

    // 停止计时器
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerStarted = false; // 重置状态
    }

    // 页面切换方法
    showHomePage() {
        this.hideAllPages();
        const homePage = document.getElementById('homePage');
        if (homePage) {
            homePage.classList.remove('hidden');
        }
        this.currentPage = 'home';
        this.updateNavigation();
        this.stopTimer();
    }

    showTopicsPage(topicIndex = 0) {
        this.hideAllPages();

        // 显示指定的选题页
        const topicsPage = document.getElementById(`topicsPage_${topicIndex}`);
        if (topicsPage) {
            topicsPage.classList.remove('hidden');
        }

        this.currentTopicIndex = topicIndex;
        this.currentPage = 'topics';
        this.updateNavigation();
        this.stopTimer();

        // 移除所有当前题目高亮，确保选题页显示统一的已选颜色
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.classList.remove('current');
        });

        // 更新导航栏按钮状态
        this.updateTopicButtons();
    }

    // 显示竞赛规则页面
    showRulesPage() {
        this.hideAllPages();
        const rulesPage = document.getElementById('rulesPage');
        if (rulesPage) {
            rulesPage.classList.remove('hidden');
        }
        this.currentPage = 'rules';
        this.updateNavigation();
        this.stopTimer();

        // 加载规则内容
        this.loadRulesContent();
    }

    // 加载规则内容
    loadRulesContent() {
        if (!this.config || !this.config.competitionRules) {
            console.warn('未找到竞赛规则配置');
            return;
        }

        const rules = this.config.competitionRules;

        // 更新标题
        const rulesTitle = document.getElementById('rulesTitle');
        if (rulesTitle) {
            rulesTitle.textContent = rules.title || '竞赛规则';
        }

        // 更新规则文本
        const rulesText = document.getElementById('rulesText');
        if (rulesText && rules.rules) {
            rulesText.innerHTML = '';
            rules.rules.forEach(rule => {
                const p = document.createElement('p');
                p.textContent = rule;
                rulesText.appendChild(p);
            });
        }

        // 更新按钮文本
        const startBtn = document.getElementById('startFromRulesBtn');
        if (startBtn) {
            startBtn.textContent = rules.buttonText || '开始答题';
        }
    }

    // 更新选题页按钮状态
    updateTopicButtons() {
        document.querySelectorAll('.topic-nav-btn').forEach((btn, index) => {
            if (index === this.currentTopicIndex) {
                btn.classList.add('active');
                // 选题页面不应禁用对应的导航按钮
                btn.disabled = false;
            } else {
                btn.classList.remove('active');
                btn.disabled = false;
            }
        });
    }

    showQuestionPage() {
        this.hideAllPages();
        const questionPage = document.getElementById('questionPage');
        if (questionPage) {
            questionPage.classList.remove('hidden');
        }
        this.currentPage = 'question';
        this.updateNavigation();
    }

    // 隐藏所有页面
    hideAllPages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.add('hidden');
        });
    }

    // 更新导航栏
    updateNavigation() {
        const navbar = document.getElementById('navbar');
        const topicsBtn = document.getElementById('topicsBtn');
        const homeBtn = document.getElementById('homeBtn');
        const rulesBtn = document.getElementById('rulesBtn');

        // 根据当前页面显示/隐藏导航栏
        if (navbar) {
            if (this.currentPage === 'home') {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
        }

        // 根据当前页面启用/禁用按钮
        if (topicsBtn) {
            if (this.currentPage === 'topics') {
                topicsBtn.disabled = true;
            } else {
                topicsBtn.disabled = false;
            }
        }

        if (homeBtn) {
            if (this.currentPage === 'home') {
                homeBtn.disabled = true;
            } else {
                homeBtn.disabled = false;
            }
        }

        if (rulesBtn) {
            // 竞赛规则页面不应禁用竞赛规则按钮
            rulesBtn.disabled = false;
        }

        // 当不在选题页面时，清除所有选题页按钮的高亮状态
        if (this.currentPage !== 'topics') {
            document.querySelectorAll('.topic-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }

    // 切换全屏
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('全屏请求失败:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // 显示加载中
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    // 隐藏加载中
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    
    // 显示错误信息
    showErrorMessage(message) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div class="error-message">
                    <h2>加载错误</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()">重新加载</button>
                </div>
            `;
            loadingOverlay.classList.remove('hidden');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.quizSystem = new QuizSystem();
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
});

// 添加错误样式
const errorStyles = `
    .error-message {
        text-align: center;
        color: #ffffff;
        padding: 40px;
    }
    .error-message h2 {
        color: #f44336;
        margin-bottom: 20px;
    }
    .error-message button {
        background: #2196F3;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
    }
    .error-message button:hover {
        background: #1976D2;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = errorStyles;
document.head.appendChild(styleElement);
