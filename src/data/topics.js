export const TOPIC_CATEGORIES = [
  { id: 'all', name: 'ぜんぶ' },
  { id: 'if', name: 'もしも・もし' },
  { id: 'secret', name: 'ひみつ・しっぱい' },
  { id: 'like', name: 'すきなもの・こだわり' },
  { id: 'experience', name: 'おもいで・たいけん' },
];

export const TOPICS = [
  // もしも・もし
  { category: 'if', text: 'もし1おく円が手に入ったら、さいしょに何に使う？' },
  { category: 'if', text: 'もし1週間どこでも自由に旅行できるなら、どこに行きたい？' },
  { category: 'if', text: 'もしとうめい人間になれたら、さいしょに何をしたい？' },
  { category: 'if', text: 'もしアニメや映画のキャラになれるなら、だれになりたい？' },
  { category: 'if', text: 'もしタイムマシンがあったら、過去と未来のどっちに行きたい？' },
  { category: 'if', text: 'もし一生1つしか食べられないとしたら、何を選ぶ？' },

  // ひみつ・しっぱい
  { category: 'secret', text: '今だから言える、むかしの恥ずかしい失敗やおもいでは？' },
  { category: 'secret', text: 'だれにも言っていない、密かにはまっている趣味はある？' },
  { category: 'secret', text: '人生でいちばん「やってしまった…！」と思った大失敗は？' },
  { category: 'secret', text: 'じつは自分だけがやっている、ちょっと変わったくせはある？' },

  // すきなもの・こだわり
  { category: 'like', text: 'おにぎりの具で、いちばん好きなものは何？' },
  { category: 'like', text: '休みの日に、いちばん幸せを感じる過ごし方は？' },
  { category: 'like', text: 'きくとテンションがあがる、大好きな曲は何？' },
  { category: 'like', text: '「これがあるから生きていける！」という大好物は何？' },

  // おもいで・たいけん
  { category: 'experience', text: 'これまでの人生で、いちばんびっくりした出来事は？' },
  { category: 'experience', text: '過去に経験した、いちばん笑ったおもしろい話は？' },
  { category: 'experience', text: 'さいきんスカッとしたことや、うれしかったことは？' },
  { category: 'experience', text: '自分が一番かがやいていたと思う瞬間はいつ？' },
];

export function getRandomTopic(categoryId = 'all') {
  const filtered = categoryId === 'all' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === categoryId);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].text;
}
