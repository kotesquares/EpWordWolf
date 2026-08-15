import React, { useState, useEffect } from 'react';
import { Dices, Play, Users, Clock, Sparkles, LogIn, PlusCircle, Shuffle } from 'lucide-react';
import { TOPIC_CATEGORIES, getRandomTopic } from '../data/topics';

export default function LobbyPhase({
  gameState,
  myPlayerId,
  isHost,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onUpdateSettings,
}) {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('epww_player_name') || '';
  });
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [topicInput, setTopicInput] = useState(gameState?.topic || 'もし1おく円が手に入ったら何に使う？');
  const [timeLimitSelect, setTimeLimitSelect] = useState(gameState?.timeLimit || 120);
  const [isJoiningMode, setIsJoiningMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomCodeInput(roomParam.toUpperCase());
      setIsJoiningMode(true);
    }
  }, []);

  useEffect(() => {
    if (gameState?.topic) {
      setTopicInput(gameState.topic);
    }
    if (gameState?.timeLimit) {
      setTimeLimitSelect(gameState.timeLimit);
    }
  }, [gameState?.topic, gameState?.timeLimit]);

  const handleSaveName = (name) => {
    setPlayerName(name);
    localStorage.setItem('epww_player_name', name);
  };

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setErrorMsg('なまえをいれてね！');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    handleSaveName(playerName.trim());
    
    // ランダム6桁コード生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await onCreateRoom(playerName.trim(), code);
    } catch (err) {
      setErrorMsg(err.message || 'へやがつくtpcなかったよ！');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setErrorMsg('なまえをいれてね！');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMsg('へやコード（6けたの数字）をいれてね！');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    handleSaveName(playerName.trim());

    try {
      await onJoinRoom(playerName.trim(), roomCodeInput.trim());
    } catch (err) {
      setErrorMsg(err.message || 'へやにはいれなかったよ！');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGacha = () => {
    const newTopic = getRandomTopic(selectedCategory);
    setTopicInput(newTopic);
    if (isHost) {
      onUpdateSettings(newTopic, timeLimitSelect);
    }
  };

  const handleTopicChange = (e) => {
    const val = e.target.value;
    setTopicInput(val);
    if (isHost) {
      onUpdateSettings(val, timeLimitSelect);
    }
  };

  const handleTimeChange = (e) => {
    const val = Number(e.target.value);
    setTimeLimitSelect(val);
    if (isHost) {
      onUpdateSettings(topicInput, val);
    }
  };

  const players = gameState?.players || [];
  const isInRoom = !!gameState?.roomCode;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      
      {/* 画面トップバナー */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>みんなで遊べる匿名すいそくゲーム！</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          誰の文章でしょう？
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          お題にこたえて、だれが書いた文章かあてっこしよう！自分の文章は上手くだましてね。
        </p>
      </div>

      {/* エラーメッセージ */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl animate-fade-in flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      {/* まだ入室していない場合のフォーム */}
      {!isInRoom ? (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-5 animate-pop">
          
          {/* 名前入力 */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              きみのなまえ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="例：たろう、名探偵"
              maxLength={12}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {/* モード切替タブ */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setIsJoiningMode(false)}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                !isJoiningMode
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              へやをつくる (ホスト)
            </button>
            <button
              onClick={() => setIsJoiningMode(true)}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                isJoiningMode
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              へやにはいる
            </button>
          </div>

          {/* 部屋を作るボタン */}
          {!isJoiningMode ? (
            <div className="space-y-3 pt-1">
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 font-extrabold py-3.5 rounded-2xl shadow-pop text-sm transition-all ${
                  isSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'へやをつくっているよ...' : 'あたらしいへやをつくる'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                ※へやをつくったホストもプレイヤーとしていっしょに遊べるよ！
              </p>
            </div>
          ) : (
            /* 部屋に参加する入力 & ボタン */
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  へやコード (数字6けた)
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="例：849201"
                  maxLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-mono font-black tracking-widest text-center text-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                />
              </div>
              <button
                onClick={handleJoin}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 font-extrabold py-3.5 rounded-2xl text-sm transition-all ${
                  isSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                <LogIn className="w-5 h-5" />
                <span>{isSubmitting ? 'へやにはいっているよ...' : 'へやにはいる'}</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        /* 入室後の待機＆設定エリア */
        <div className="space-y-6 animate-fade-in">
          
          {/* お題設定カード */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 今回のお題
              </span>
              {isHost && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                  ホストがかえられるよ
                </span>
              )}
            </div>

            {/* お題入力フォーム（ホスト編集 / ゲスト表示） */}
            {isHost ? (
              <div className="space-y-3">
                <textarea
                  value={topicInput}
                  onChange={handleTopicChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="お題を自由に入力してね"
                />

                {/* お題ガチャ枠 */}
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Dices className="w-3.5 h-3.5 text-indigo-500" /> お題ガチャ
                    </span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none"
                    >
                      {TOPIC_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleGacha}
                    className="w-full flex items-center justify-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-xl text-xs transition-colors border border-indigo-100"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>ランダムでお題をひくよ</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ゲスト閲覧用 */
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl text-center">
                <p className="text-base font-extrabold text-blue-950 leading-snug">
                  「{gameState.topic}」
                </p>
              </div>
            )}

            {/* 制限時間設定 */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> めやすの制限時間
              </span>
              {isHost ? (
                <select
                  value={timeLimitSelect}
                  onChange={handleTimeChange}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value={60}>60秒 (ハヤイ)</option>
                  <option value={90}>90秒 (ふつう)</option>
                  <option value={120}>120秒 (じっくり)</option>
                  <option value={180}>180秒 (ながめ)</option>
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {gameState.timeLimit}秒 (めやす)
                </span>
              )}
            </div>

          </div>

          {/* 参加プレイヤー一覧カード */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" /> さんかメンバー ({players.length}名)
              </h3>
              <span className="text-xs font-bold text-slate-400">
                2人以上でスタートできるよ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border flex items-center space-x-2.5 transition-all ${
                    p.id === myPlayerId
                      ? 'bg-blue-50/80 border-blue-200 shadow-sm'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${p.avatarColor || 'bg-blue-500'} flex items-center justify-center text-white font-extrabold text-xs shadow-sm flex-shrink-0`}>
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                    {p.isHost && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                        HOST
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ゲーム開始アクションボタン */}
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={players.length < 2}
              className={`w-full flex items-center justify-center space-x-2 font-black py-4 rounded-2xl text-base shadow-pop transition-all ${
                players.length >= 2
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{players.length < 2 ? 'みんなが集まるのを待っているよ (2人〜)' : '全員そろったからスタート！'}</span>
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-2xl text-center space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <p className="text-xs font-bold">ホストがスタートするのを待っているよ…</p>
              </div>
              <p className="text-[11px] text-blue-600 font-medium">回答のじゅんびをしておいてね！</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
