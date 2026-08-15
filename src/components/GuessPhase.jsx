import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, Clock, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

export default function GuessPhase({
  gameState,
  myPlayerId,
  isHost,
  onSubmitVote,
  onNextEpisode,
}) {
  const [selectedGuessId, setSelectedGuessId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const players = gameState?.players || [];
  const answers = gameState?.answers || {};
  const episodeOrder = gameState?.episodeOrder || [];
  const currentIndex = gameState?.currentEpisodeIndex ?? 0;
  const timeRemaining = gameState?.timeRemaining ?? 0;
  const votes = gameState?.votes || {};

  const currentEpisodeAuthorId = episodeOrder[currentIndex];
  const currentAnswerText = answers[currentEpisodeAuthorId] || '回答が送信されていません';

  const currentVotes = votes[currentEpisodeAuthorId] || {};
  const votedVoterCount = Object.keys(currentVotes).length;
  const totalPlayers = players.length;

  const myVote = currentVotes[myPlayerId];
  const isMyVoteCompleted = !!myVote || hasVoted;

  useEffect(() => {
    setSelectedGuessId(null);
    setHasVoted(false);
  }, [currentIndex]);

  const handleVoteSubmit = () => {
    if (!selectedGuessId) return;
    onSubmitVote(selectedGuessId);
    setHasVoted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* 画面ヘッダー ＆ 進捗 */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PHASE 2: 誰の文章でしょう？
          </span>
          <h2 className="text-xs font-bold text-slate-500 mt-1">
            えらばれたエピソード <span className="text-purple-600 font-extrabold text-sm">(1けん)</span>
          </h2>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Clock className={`w-4 h-4 ${timeRemaining > 0 ? 'text-purple-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-black font-mono text-slate-800">
            {timeRemaining > 0 ? `${timeRemaining}秒` : '0秒 (めやす)'}
          </span>
        </div>
      </div>

      {/* 匿名エピソード読み上げカード */}
      <div className="bg-white rounded-3xl p-6 shadow-pop border border-slate-200 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-purple-100">
          <HelpCircle className="w-16 h-16 opacity-30" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            <Sparkles className="w-3.5 h-3.5" /> とくめいエピソード
          </div>
          <blockquote className="text-lg sm:text-xl font-extrabold text-slate-800 leading-relaxed tracking-tight bg-slate-50 p-4 rounded-2xl border border-slate-100">
            「{currentAnswerText}」
          </blockquote>
          <p className="text-[11px] text-slate-400 font-medium text-right">
            ※だれが書いた文章かあててね！
          </p>
        </div>
      </div>

      {/* 推測投票セクション */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-purple-500" /> かいた人を予想してえらんでね
          </h3>
          <span className="text-[11px] font-bold text-purple-600 font-mono">
            {votedVoterCount} / {totalPlayers}人かんりょう
          </span>
        </div>

        {!isMyVoteCompleted ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {players.map((p) => {
                const isSelected = selectedGuessId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedGuessId(p.id)}
                    className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 transition-all text-left ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${p.avatarColor || 'bg-purple-500'} flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0`}>
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate flex-1">{p.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleVoteSubmit}
              disabled={!selectedGuessId}
              className={`w-full flex items-center justify-center space-x-2 font-extrabold py-3.5 rounded-2xl text-sm transition-all ${
                selectedGuessId
                  ? 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white shadow-pop'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>この人だと予想してとうひょうする</span>
            </button>
          </div>
        ) : (
          /* 投票済みカード */
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center space-y-1.5">
            <p className="text-xs font-extrabold text-purple-900">
              とうひょうしたよ！
            </p>
            <p className="text-[11px] text-purple-700 font-medium">
              {votedVoterCount >= totalPlayers
                ? '🎉 全員のとうひょうがおわったよ！ホストがけっかを開くのをまってね…'
                : 'ホストがけっかを開くまでまっていてね…'}
            </p>
          </div>
        )}

      </div>

      {/* ホスト専用：結果発表へ進むボタン */}
      {isHost && (
        <div className="pt-2 space-y-2">
          {votedVoterCount >= totalPlayers && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl text-center animate-bounce-short">
              🎉 全員のとうひょうがおわったよ！ボタンを押してけっかを開こう
            </div>
          )}
          <button
            onClick={onNextEpisode}
            className={`w-full flex items-center justify-center space-x-2 font-extrabold py-4 rounded-2xl text-sm transition-all ${
              votedVoterCount >= totalPlayers
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] text-white shadow-pop animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{votedVoterCount >= totalPlayers ? '🎉 けっか発表をひらく (ホスト)' : 'けっか発表をひらく (ホスト)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
