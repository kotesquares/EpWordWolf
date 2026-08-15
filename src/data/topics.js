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
  { category: 'if', text: 'もし一生1つの料理しか食べられないとしたら、何を選ぶ？' },
  { category: 'if', text: 'もし無人島に1つだけ持っていけるとしたら、何を持っていく？' },
  { category: 'if', text: 'もし魔法が1つだけ使えるとしたら、どんな魔法がいい？' },
  { category: 'if', text: 'もし1日だけ動物になれるなら、何の動物になりたい？' },
  { category: 'if', text: 'もし自分が超有名人になったら、どんなことで有名になりたい？' },

  // 秘密・失敗談
  { category: 'secret', text: '今だから言える、昔の恥ずかしい失敗や思い出は？' },
  { category: 'secret', text: '誰にも言っていない、密かにはまっている趣味はある？' },
  { category: 'secret', text: '人生で一番「やってしまった…！」と思った大失敗は？' },
  { category: 'secret', text: '実は自分だけがやっている、ちょっと変わった癖はある？' },
  { category: 'secret', text: '今までについてしまった、くすっと笑える小さな嘘は？' },
  { category: 'secret', text: 'テストや仕事で、思い出すと恥ずかしくなるドジな失敗は？' },
  { category: 'secret', text: '子供の頃に「かん違い」していた面白い思い込みはある？' },
  { category: 'secret', text: 'お店や旅先で体験した、ちょっと気まずかった出来事は？' },

  // 好きなもの・こだわり
  { category: 'like', text: 'おにぎりの具で、一番好きなものは何？' },
  { category: 'like', text: '休みの日に、一番幸せを感じる過ごし方は？' },
  { category: 'like', text: '聴くとテンションが上がる、大好きな曲は何？' },
  { category: 'like', text: '「これがあるから生きていける！」という大好物は何？' },
  { category: 'like', text: '自分の中でゆずれない、ラーメンやカレーのこだわりは？' },
  { category: 'like', text: 'テンションが一気に上がる、テンション爆上がりスポットはどこ？' },
  { category: 'like', text: 'ついついコンビニで買ってしまう大好きなスイーツやアイスは？' },
  { category: 'like', text: '異性や人の仕草で「いいな！」とキュンとするポイントは？' },
  { category: 'like', text: '部屋や机の上にこれがあるとテンションが上がるお気に入りアイテムは？' },

  // 思い出・体験
  { category: 'experience', text: 'これまでの人生で、一番びっくりした出来事は？' },
  { category: 'experience', text: '過去に経験した、一番笑った面白い話は？' },
  { category: 'experience', text: '最近スカッとしたことや、嬉しかったことは？' },
  { category: 'experience', text: '自分が一番輝いていたと思う瞬間はいつ？' },
  { category: 'experience', text: '学生時代の行事（運動会や修学旅行など）で一番印象に残っている思い出は？' },
  { category: 'experience', text: '人生で一番感動して泣いてしまった映画や本は？' },
  { category: 'experience', text: 'たまたま遭遇した、ちょっと珍しいラッキーな体験はある？' },
  { category: 'experience', text: 'これまでに見た中で、一番きれいだった景色や場所はどこ？' },
];

export function getRandomTopic(categoryId = 'all') {
  const filtered = categoryId === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === categoryId);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].text;
}
