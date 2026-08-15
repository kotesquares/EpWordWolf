import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles, CheckCircle2, UserX, Crown, Target, Flame } from 'lucide-react';

export default function ResultPhase({
  gameState,
  myPlayerId,
  isHost,
  onRestart,
}) {
  const players = gameState?.players || [];
  const answers = gameState?.answers || {};
  const votes = gameState?.votes || {};
  const scores = gameState?.scores || {};
  const topic = gameState?.topic || '';

  const rankedPlayers = [...players].sort((a, b) => {
    const scoreA = scores[a.id]?.total || 0;
    const scoreB = scores[b.id]?.total || 0;
    return scoreB - scoreA;
  });

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      console.log('Confetti effect failed', e);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* トップヘッダー */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold px-3.5 py-1 rounded-full shadow-sm animate-bounce-short">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>結果発表だよ！</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          正解公開 ＆ 最終スコア
        </h2>
        <p className="text-xs text-slate-500">
          お題：「{topic}」
        </p>
      </div>

      {/* 🎉 正解（だれの発言・文章だったか）の特大目立つメイン演出カード */}
      <div className="space-y-4">
        {Object.entries(answers).map(([authorId, answerText]) => {
          const author = players.find(p => p.id === authorId);
          const episodeVotes = votes[authorId] || {};

          // 見破った他プレイヤーの人数と、騙された他プレイヤーの人数
          const correctVoters = Object.entries(episodeVotes).filter(([voterId, guessedId]) => voterId !== authorId && guessedId === authorId);
          const trickedVoters = Object.entries(episodeVotes).filter(([voterId, guessedId]) => voterId !== authorId && guessedId !== authorId);

          return (
            <div key={authorId} className="bg-white rounded-3xl shadow-pop border border-purple-200 overflow-hidden animate-pop space-y-0">
              
              {/* 正解者（作者）特大強調ハイライトヘッダー */}
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white text-center space-y-3 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <span className="inline-flex items-center space-x-1 text-[11px] font-black bg-amber-400 text-amber-950 px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> このエピソードを書いたのは・・・
                </span>

                {/* 作者特大アバター＆名前 */}
                <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                  <div className={`w-16 h-16 rounded-full ${author?.avatarColor || 'bg-amber-400'} border-4 border-white flex items-center justify-center text-white text-2xl font-black shadow-xl animate-bounce-short`}>
                    {author?.name ? author.name.charAt(0) : '?'}
                  </div>
                  <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>{author?.name || '不明'} さん！</span>
                  </div>
                </div>

                {/* 成績ショートサマリーバッジ */}
                <div className="flex items-center justify-center space-x-2 pt-1 text-xs font-bold">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-300" /> 見破った人: {correctVoters.length}人
                  </span>
                  {trickedVoters.length > 0 && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-amber-200 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-300" /> だまされた人: {trickedVoters.length}人
                    </span>
                  )}
                </div>
              </div>

              {/* エピソード本文カード */}
              <div className="p-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl relative">
                  <span className="text-3xl text-purple-300 font-serif absolute -top-2 left-2 pointer-events-none">“</span>
                  <blockquote className="text-base font-extrabold text-slate-800 leading-relaxed px-3 py-1">
                    {answerText}
                  </blockquote>
                  <span className="text-3xl text-purple-300 font-serif absolute -bottom-4 right-2 pointer-events-none">”</span>
                </div>

                {/* みんなの投票結果明細 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    みんなの予想投票結果:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(episodeVotes).map(([voterId, guessedId]) => {
                      const voter = players.find(p => p.id === voterId);
                      const guessed = players.find(p => p.id === guessedId);
                      const isSelfVote = voterId === authorId;
                      const isCorrect = guessedId === authorId;

                      return (
                        <div
                          key={voterId}
                          className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                            isSelfVote
                              ? 'bg-slate-100 border-slate-200 text-slate-600 opacity-80'
                              : isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                              : 'bg-rose-50/70 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full ${voter?.avatarColor || 'bg-slate-400'} text-white text-[10px] font-bold flex items-center justify-center`}>
                              {voter?.name ? voter.name.charAt(0) : '?'}
                            </div>
                            <span className="text-xs font-bold truncate max-w-[90px]">{voter?.name}</span>
                          </div>

                          <div className="flex items-center space-x-1.5 text-xs font-bold">
                            <span className="text-[11px] opacity-75">➔ {guessed?.name}</span>
                            {isSelfVote ? (
                              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                自分の投票 (対象外)
                              </span>
                            ) : isCorrect ? (
                              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> 見破り成功！
                              </span>
                            ) : (
                              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <UserX className="w-3 h-3 text-rose-500" /> 不正解
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* スコアランキングカード */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Trophy className="w-4 h-4 text-amber-500" /> 最終ポイントランキング
        </h3>

        <div className="space-y-2.5">
          {rankedPlayers.map((p, index) => {
            const playerScore = scores[p.id] || { total: 0, currentRound: 0, correctGuesses: 0, trickedOthers: 0 };
            const isTop = index === 0;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isTop
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md ring-2 ring-amber-400/30'
                    : p.id === myPlayerId
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    index === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                    index === 1 ? 'bg-slate-300 text-slate-800' :
                    index === 2 ? 'bg-amber-700/20 text-amber-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {index === 0 ? <Crown className="w-5 h-5 text-amber-950" /> : `${index + 1}`}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-extrabold text-slate-800">{p.name}</span>
                      {p.id === myPlayerId && (
                        <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded">君</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 mt-0.5">
                      <span className="text-emerald-600">見破り: {playerScore.correctGuesses}回</span>
                      <span>•</span>
                      <span className="text-purple-600">だまし: {playerScore.trickedOthers}人</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black font-mono text-blue-600">
                    {playerScore.total} <span className="text-xs font-sans text-slate-500">pt</span>
                  </div>
                  {playerScore.currentRound > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      +{playerScore.currentRound}pt
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ホスト専用：再スタートボタン */}
      {isHost ? (
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-black py-4 rounded-2xl text-base shadow-pop transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          <span>お題を変えてもう一度遊ぶ</span>
        </button>
      ) : (
        <div className="bg-slate-100 border border-slate-200 text-slate-600 p-4 rounded-2xl text-center text-xs font-bold">
          ホストが次のゲームを始めるのを待っているよ…
        </div>
      )}

    </div>
  );
}
