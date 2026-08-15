export const TOPIC_CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'if', name: 'もしも・妄想' },
  { id: 'secret', name: '秘密・失敗談' },
  { id: 'like', name: '好きなもの・こだわり' },
  { id: 'experience', name: '思い出・体験' },
];

export const TOPICS = [
  // もしも・妄想
  { category: 'if', text: 'もし1億円が手に入ったら、最初は何に使う？' },
  { category: 'if', text: 'もし1週間どこでも自由に旅行できるなら、どこに行きたい？' },
  { category: 'if', text: 'もし透明人間になれたら、最初に何をしたい？' },
  { category: 'if', text: 'もしアニメや映画のキャラになれるなら、誰になりたい？' },
  { category: 'if', text: 'もしタイムマシンがあったら、過去と未来のどっちに行きたい？' },
  { category: 'if', text: 'もし一生1つしか食べられないとしたら、何を選ぶ？' },

  // 秘密・失敗談
  { category: 'secret', text: '今だから言える、昔の恥ずかしい失敗や思い出は？' },
  { category: 'secret', text: '誰にも言っていない、密かにはまっている趣味はある？' },
  { category: 'secret', text: '人生で一番「やってしまった…！」と思った大失敗は？' },
  { category: 'secret', text: '実は自分だけがやっている、ちょっと変わった癖はある？' },

  // 好きなもの・こだわり
  { category: 'like', text: 'おにぎりの具で、一番好きなものは何？' },
  { category: 'like', text: '休みの日に、一番幸せを感じる過ごし方は？' },
  { category: 'like', text: '聴くとテンションが上がる、大好きな曲は何？' },
  { category: 'like', text: '「これがあるから生きていける！」という大好物は何？' },

  // 思い出・体験
  { category: 'experience', text: 'これまでの人生で、一番びっくりした出来事は？' },
  { category: 'experience', text: '過去に経験した、一番笑った面白い話は？' },
  { category: 'experience', text: '最近スカッとしたことや、嬉しかったことは？' },
  { category: 'experience', text: '自分が一番輝いていたと思う瞬間はいつ？' },
];

export function getRandomTopic(categoryId = 'all') {
  const filtered = categoryId === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === categoryId);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].text;
}
