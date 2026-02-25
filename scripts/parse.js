const fs = require('fs');
const path = require('path');

// 读取 MD 文件
const mdPath = path.resolve(__dirname, '../gzallen.md');
const content = fs.readFileSync(mdPath, 'utf-8');

// 标签定义 - 基于意图匹配
const tagRules = [
  {
    tag: '产品哲学',
    keywords: ['产品', '用户', '体验', '功能', '设计', '需求', '简洁', '复杂', '界面', '交互'],
    patterns: ['一个产品', '产品经理', '用户体验', '产品设计', '功能', '简单', '复杂']
  },
  {
    tag: '用户洞察',
    keywords: ['用户', '人性', '心理', '行为', '习惯', '欲望', '虚荣', '贪婪', '恐惧', '炫耀'],
    patterns: ['用户喜欢', '用户爱', '虚荣', '炫耀', '人性', '心理']
  },
  {
    tag: '互联网思考',
    keywords: ['互联网', '网络', '微博', '推特', '饭否', 'sns', '社交', '平台', '流量', '数据'],
    patterns: ['互联网', '微博', '推特', '饭否', 'sns', '社交网络', '平台']
  },
  {
    tag: '技术观点',
    keywords: ['技术', '代码', '编程', '算法', '架构', '数据库', 'api', '前端', '后端'],
    patterns: ['程序设计', '算法', 'api', '代码', '技术']
  },
  {
    tag: '读书笔记',
    keywords: ['书', '读', '作者', '章节', '出版', '推荐', '书单'],
    patterns: ['《', '书', '读过', '在看', '推荐', 'book']
  },
  {
    tag: '生活随笔',
    keywords: ['睡觉', '吃饭', '心情', '感觉', '今天', '昨天', '晚上', '早上', '天气'],
    patterns: ['吃饭', '睡觉', '心情', '感觉', '困', '晕', '累']
  },
  {
    tag: '幽默段子',
    keywords: ['哈哈', '笑话', '搞笑', '幽默', '段子', '吐槽'],
    patterns: ['哈哈', '幽默', '段子', '吐槽', 'nnd', 'tmd', '傻逼', '牛b']
  },
  {
    tag: '转发引用',
    keywords: [],
    patterns: ['转@', '转自', '转@', 'RT @']
  },
  {
    tag: '饭否相关',
    keywords: ['饭否', 'fanfou'],
    patterns: ['饭否']
  },
  {
    tag: '苹果相关',
    keywords: ['apple', 'mac', 'ipad', 'iphone', 'ios', '乔布斯', 'steve', 'app store'],
    patterns: ['mac', 'ipad', 'iphone', 'ios', 'apple', '乔布斯', 'app store', 'safari']
  },
  {
    tag: 'Google',
    keywords: ['google', 'gmail', 'android', 'chrome'],
    patterns: ['google', 'gmail', 'chrome', 'android']
  },
  {
    tag: '微信相关',
    keywords: ['微信', 'wechat', 'wx'],
    patterns: ['微信', 'wechat']
  },
  {
    tag: '哲学思考',
    keywords: ['意义', '本质', '为什么', '什么是', '哲学', '思考', '存在', '意识'],
    patterns: ['意义', '本质', '哲学', '什么是', '为什么', '存在', '意识']
  },
  {
    tag: '管理思考',
    keywords: ['团队', '管理', '同事', '公司', '开会', '决策', '领导'],
    patterns: ['团队', '管理', '同事', '公司', '开会', '决策']
  },
];

// 自动标签函数 - 基于意图匹配
function autoTag(content) {
  const tags = new Set();
  const lowerContent = content.toLowerCase();

  for (const rule of tagRules) {
    let match = false;

    // 检查关键词
    if (rule.keywords.length > 0) {
      for (const keyword of rule.keywords) {
        if (lowerContent.includes(keyword.toLowerCase())) {
          match = true;
          break;
        }
      }
    }

    // 检查模式
    if (!match && rule.patterns.length > 0) {
      for (const pattern of rule.patterns) {
        if (lowerContent.includes(pattern.toLowerCase())) {
          match = true;
          break;
        }
      }
    }

    // 特殊规则：转发引用
    if (rule.tag === '转发引用') {
      if (/转@|转自|RT @/i.test(content)) {
        match = true;
      }
    }

    if (match) {
      tags.add(rule.tag);
    }
  }

  return Array.from(tags);
}

// 解析函数
function parseDiary(content) {
  const lines = content.split('\n');
  const entries = [];
  let currentYear = null;
  let currentMonth = null;
  let currentDate = null;
  let entryId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳过空行
    if (!line) continue;

    // 匹配年份和月份: "2010 年 11 月" 或 "2010年11月"
    const yearMonthMatch = line.match(/(\d{4})\s*年\s*(\d{1,2})\s*月/);
    if (yearMonthMatch) {
      currentYear = parseInt(yearMonthMatch[1]);
      currentMonth = parseInt(yearMonthMatch[2]);
      continue;
    }

    // 匹配日期: "2010-11-26"
    const dateMatch = line.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (dateMatch) {
      currentDate = line;
      continue;
    }

    // 匹配日记条目: "序号. 内容 时间戳"
    // 格式: "1. 新账号上路！ 2010-11-26 13:59"
    const entryMatch = line.match(/^(\d+)\.\s+(.+?)\s+(\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2})/);
    if (entryMatch) {
      const num = parseInt(entryMatch[1]);
      let text = entryMatch[2].trim();

      // 处理可能的附加信息（如"转自xxx"、"给xxx的回复"等）
      let extraInfo = '';
      let type = 'original';

      // 检查是否是转发或回复
      if (text.includes('转@') || text.includes('转自')) {
        type = 'repost';
        // 提取转发来源
        const repostMatch = text.match(/(转自|转@)\s*(\S+)/);
        if (repostMatch) {
          extraInfo = `转自 ${repostMatch[2]}`;
        }
      } else if (text.includes('给')) {
        const replyMatch = text.match(/给(\S+)的回复/);
        if (replyMatch) {
          type = 'reply';
          extraInfo = `回复 ${replyMatch[1]}`;
        }
      }

      // 清理文本，移除附加信息
      text = text
        .replace(/\s*转自\S+/g, '')
        .replace(/\s*转@\S+/g, '')
        .replace(/\s*给\S+的回复.*/g, '')
        .replace(/\s*通过\s*\S+/g, '')
        .trim();

      const timestamp = entryMatch[3];
      const tags = autoTag(text);

      entries.push({
        id: entryId++,
        num: num,
        content: text,
        date: currentDate,
        timestamp: timestamp,
        year: currentYear,
        month: currentMonth,
        type: type,
        extraInfo: extraInfo,
        tags: tags,
        tagsCount: tags.length
      });
    }
  }

  return entries;
}

// 解析并生成数据
const entries = parseDiary(content);

// 按时间分组
const groupedByMonth = {};
entries.forEach(entry => {
  const key = `${entry.year}-${String(entry.month).padStart(2, '0')}`;
  if (!groupedByMonth[key]) {
    groupedByMonth[key] = [];
  }
  groupedByMonth[key].push(entry);
});

// 生成统计数据
const allTags = new Set();
entries.forEach(e => e.tags.forEach(t => allTags.add(t)));

const stats = {
  totalEntries: entries.length,
  totalTags: allTags.size,
  yearRange: {
    start: entries[0]?.year || 2010,
    end: entries[entries.length - 1]?.year || 2010
  },
  months: Object.keys(groupedByMonth).sort(),
  tags: Array.from(allTags).sort()
};

// 输出目录
const outputDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 写入完整数据
fs.writeFileSync(
  path.join(outputDir, 'diary.json'),
  JSON.stringify(entries, null, 2)
);

// 写入分组数据
fs.writeFileSync(
  path.join(outputDir, 'diary-grouped.json'),
  JSON.stringify(groupedByMonth, null, 2)
);

// 写入统计数据
fs.writeFileSync(
  path.join(outputDir, 'stats.json'),
  JSON.stringify(stats, null, 2)
);

console.log(`✅ 解析完成！`);
console.log(`📝 总条目数: ${stats.totalEntries}`);
console.log(`🏷️  标签数量: ${stats.totalTags}`);
console.log(`📅 时间范围: ${stats.yearRange.start} - ${stats.yearRange.end}`);
console.log(`📂 数据已保存到: ${outputDir}`);
