import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Clock, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function AnswerPhase({
  gameState,
  myPlayerId,
  isHost,
  onSubmitAnswer,
  onStartGuess,
}) {
  const [answerText, setAnswerText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHostDialog, setShowHostDialog] = useState(false);

  const topic = gameState?.topic || '';
  const players = gameState?.players || [];
  const answers = gameState?.answers || {};

  const submittedCount = Object.keys(answers).length;
  const totalPlayers = players.length;
  const isMyAnswerSubmitted = !!answers[myPlayerId] || hasSubmitted;

  // ホストで全員の回答が揃った瞬間、ダイアログを自動表示
  useEffect(() => {
    if (isHost && submittedCount >= totalPlayers && totalPlayers > 0) {
      setShowHostDialog(true);
    }
  }, [isHost, submittedCount, totalPlayers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onSubmitAnswer(answerText.trim());
    setHasSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 animate-fade-in relative">
      
      {/* 画面ヘッダー ＆ ステータス */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PHASE 1: エピソードを書くよ
          </span>
          <h2 className="text-xs font-bold text-slate-500 mt-1">お題への回答を書いてね</h2>
        </div>
        <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
          <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-xs font-bold">回答受付中</span>
        </div>
      </div>

      {/* お題カード */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-pop relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full inline-block">
            今回のお題
          </span>
          <p className="text-lg font-black leading-snug tracking-tight">
            「{topic}」
          </p>
          <p className="text-[11px] text-blue-100/80">
            ※自分の回答だとバレないように書き方を工夫してね！
          </p>
        </div>
      </div>

      {/* 入力フォーム / 送信完了画面 */}
      {!isMyAnswerSubmitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-blue-500" /> エピソード・回答を入力してね
            </label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={4}
              maxLength={150}
              placeholder="ここに文章を書いてね（例：昔修学旅行で大失敗をして…）"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:font-normal placeholder:text-slate-400"
            />
            <div className="text-right text-[11px] text-slate-400 font-bold mt-1">
              {answerText.length} / 150文字
            </div>
          </div>

          <button
            type="submit"
            disabled={!answerText.trim()}
            className={`w-full flex items-center justify-center space-x-2 font-extrabold py-3.5 rounded-2xl text-sm transition-all ${
              answerText.trim()
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-pop'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>匿名で送るよ</span>
          </button>
        </form>
      ) : (
        /* 送信後の待機カード */
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 text-center space-y-3 animate-pop">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-emerald-900">
            回答を送ったよ！
          </h3>
          <p className="text-xs text-emerald-700 font-medium max-w-xs mx-auto">
            みんなの回答が集まるまで待っていてね。
          </p>
        </div>
      )}

      {/* リアルタイム進捗状況 */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">みんなの回答状況</span>
          <span className="text-blue-600 font-mono font-black">{submittedCount} / {totalPlayers}人完了</span>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(submittedCount / totalPlayers) * 100}%` }}
          />
        </div>

        {/* プレイヤー別送信ステータスアイコン */}
        <div className="flex flex-wrap gap-2 pt-2">
          {players.map((p) => {
            const isSubmitted = !!answers[p.id];
            return (
              <div
                key={p.id}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                  isSubmitted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isSubmitted ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span>{p.name}</span>
                {isSubmitted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ホスト専用：手動スタートボタン */}
      {isHost && (
        <div className="pt-2 space-y-2">
          {submittedCount >= totalPlayers && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl text-center animate-bounce-short">
              🎉 全員の回答が集まったよ！
            </div>
          )}
          <button
            onClick={() => setShowHostDialog(true)}
            disabled={submittedCount === 0}
            className={`w-full flex items-center justify-center space-x-2 font-extrabold py-4 rounded-2xl text-sm transition-all ${
              submittedCount >= totalPlayers
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white shadow-pop animate-pulse'
                : submittedCount > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {submittedCount >= totalPlayers
                ? '🎉 全員そろったよ！推測を始める (ホスト)'
                : '回答を締め切って推測を始める (ホスト)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ホスト専用：全員回答完了ポップアップモーダルダイアログ */}
      {isHost && showHostDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-pop">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 leading-snug">
                全員の回答がそろいました。<br />今回当ててもらうのは・・・
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                OKを押すとランダムに選ばれた1つの回答が発表されて、話し合いがスタートするよ！
              </p>
            </div>

            <button
              onClick={() => {
                setShowHostDialog(false);
                onStartGuess();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-black py-4 rounded-2xl text-sm shadow-pop transition-all"
            >
              <span>OK (話し合いをスタートする)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
