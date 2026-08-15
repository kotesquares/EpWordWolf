import React, { useState } from 'react';
import { Users, QrCode, Copy, Check, MessageSquareHeart, Sparkles } from 'lucide-react';

export default function Header({ gameState, myPlayerId, onOpenQR }) {
  const [copied, setCopied] = useState(false);
  const [showPlayersList, setShowPlayersList] = useState(false);

  const handleCopyCode = () => {
    if (!gameState?.roomCode) return;
    navigator.clipboard.writeText(gameState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const players = gameState?.players || [];
  const roomCode = gameState?.roomCode || '';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ロゴ */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 text-base leading-tight tracking-tight flex items-center gap-1">
              誰の文章？
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">
                人狼風
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">エピソード推測ゲーム</p>
          </div>
        </div>

        {/* 右側：ルーム情報・QR・プレイヤー一覧 */}
        {roomCode && (
          <div className="flex items-center space-x-2">
            
            {/* ルームコード・コピーボタン */}
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-200/80"
              title="ルームコードをコピー"
            >
              <span className="text-slate-400 font-normal">CODE:</span>
              <span className="tracking-wider text-blue-600 font-mono font-extrabold">{roomCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* QRコードボタン */}
            <button
              onClick={onOpenQR}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
              title="招待QRコードを表示"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* プレイヤー数ボタン */}
            <button
              onClick={() => setShowPlayersList(!showPlayersList)}
              className="flex items-center space-x-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-200/60"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{players.length}人</span>
            </button>
          </div>
        )}
      </div>

      {/* プレイヤー一覧ドロップダウン/モーダル */}
      {showPlayersList && (
        <div className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 animate-pop">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> 参加プレイヤー ({players.length}名)
            </h3>
            <button
              onClick={() => setShowPlayersList(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium ${
                  p.id === myPlayerId ? 'bg-blue-50 text-blue-900 border border-blue-100' : 'bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full ${p.avatarColor || 'bg-blue-500'} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="font-semibold truncate max-w-[110px]">{p.name}</span>
                  {p.id === myPlayerId && (
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded font-bold">あなた</span>
                  )}
                </div>
                {p.isHost && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> HOST
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
