export const TOPIC_CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'if', name: 'もしも・妄想' },
  { id: 'secret', name: '秘密・黒歴史' },
  { id: 'like', name: 'こだわり・お好み' },
  { id: 'experience', name: '体験・思い出' },
];

export const TOPICS = [
  // もしも・妄想
  { category: 'if', text: 'もし1億円が手に入ったら、真っ先に何に使う？' },
  { category: 'if', text: 'もし明日から1週間自由に旅行できるならどこに行く？' },
  { category: 'if', text: 'もし透明人間になれたら、最初にやりたいことは？' },
  { category: 'if', text: 'もし自分がアニメや映画のキャラクターになれるなら誰？' },
  { category: 'if', text: 'もしタイムマシンがあったら、過去と未来どちらに行って何をする？' },
  { category: 'if', text: 'もし一生1種類しか食べられないとしたら何を選ぶ？' },

  // 秘密・黒歴史
  { category: 'secret', text: '今だから言える、学生時代の恥ずかしい思い出・失敗談は？' },
  { category: 'secret', text: '誰にも言ってないけど、実は密かにハマっているマニアックな趣味は？' },
  { category: 'secret', text: '人生で一番「やってしまった…！」と思った大失敗は？' },
  { category: 'secret', text: '実は人には見せられない自分だけの変わった癖（くせ）は？' },
  { category: 'secret', text: '今までについた、クスッと笑える嘘は？' },

  // こだわり・お好み
  { category: 'like', text: '自分の中で譲れない「おにぎりの具」最高峰は？' },
  { category: 'like', text: '休日に一番幸せを感じる最高の過ごし方は？' },
  { category: 'like', text: 'テンションが爆上がりする勝負ソング・大好きな曲は？' },
  { category: 'like', text: '異性のキュンとする仕草やポイントは？' },
  { category: 'like', text: '「これがあるから生きていける！」という大好物は？' },

  // 体験・思い出
  { category: 'experience', text: 'これまでの人生で一番恐怖を感じた出来事は？' },
  { category: 'experience', text: '過去に経験した一番笑った出来事・エピソードは？' },
  { category: 'experience', text: '人生のターニングポイントになった出来事や出会いは？' },
  { category: 'experience', text: '最近スカッとした出来事・嬉しかったことは？' },
  { category: 'experience', text: '自分が一番輝いていたと思う瞬間は？' },
];

export function getRandomTopic(categoryId = 'all') {
  const filtered = categoryId === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === categoryId);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].text;
}
