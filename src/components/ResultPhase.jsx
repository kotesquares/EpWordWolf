import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles, CheckCircle2, UserX, Crown } from 'lucide-react';

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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      console.log('Confetti effect failed', e);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* トップヘッダー */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold px-3.5 py-1 rounded-full shadow-sm">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>結果発表だよ！</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          スコアランキング
        </h2>
        <p className="text-xs text-slate-500">
          お題：「{topic}」
        </p>
      </div>

      {/* スコアランキングカード */}
      <div className="bg-white rounded-3xl p-6 shadow-pop border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          RANKING
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
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md'
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
                      <span className="text-emerald-600">当てた: {playerScore.correctGuesses}回</span>
                      <span>•</span>
                      <span className="text-purple-600">だました: {playerScore.trickedOthers}人</span>
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

      {/* エピソード別・正解 ＆ 誰が誰を選んだかの明細 */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
        <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" /> 正解と投票の内訳
        </h3>

        <div className="space-y-4">
          {Object.entries(answers).map(([authorId, answerText], i) => {
            const author = players.find(p => p.id === authorId);
            const episodeVotes = votes[authorId] || {};

            return (
              <div key={authorId} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[11px] font-bold text-slate-400">ピックアップ・エピソード</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-slate-500 font-medium">本当の書いた人：</span>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      {author?.name || '不明'} さん
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-800 bg-white p-3 rounded-xl border border-slate-100">
                  「{answerText}」
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    みんなの予想投票:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {Object.entries(episodeVotes).map(([voterId, guessedId]) => {
                      const voter = players.find(p => p.id === voterId);
                      const guessed = players.find(p => p.id === guessedId);
                      const isCorrect = guessedId === authorId;

                      return (
                        <div
                          key={voterId}
                          className={`text-xs p-2 rounded-xl flex items-center justify-between border ${
                            isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                          }`}
                        >
                          <span className="font-bold truncate">{voter?.name}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] opacity-70">➔ {guessed?.name}</span>
                            {isCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <UserX className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
