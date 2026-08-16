import React, { useState } from 'react';
import { Users, QrCode, Copy, Check, MessageSquareHeart, Sparkles, LogOut } from 'lucide-react';

export default function Header({ gameState, myPlayerId, onOpenQR, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);
  const [showPlayersList, setShowPlayersList] = useState(false);

  const handleCopyCode = () => {
    if (!gameState?.roomCode) return;
    navigator.clipboard.writeText(gameState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveClick = () => {
    if (window.confirm('本当に部屋を抜けるよ？いいかな？')) {
      onLeaveRoom();
    }
  };

  const players = gameState?.players || [];
  const roomCode = gameState?.roomCode || '';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ロゴ */}
        <div className="flex items-center space-x-2.5">
          <img
            src="./icons/eww192.png"
            alt="誰の文章？"
            className="w-9 h-9 rounded-xl shadow-sm border border-slate-100 object-cover"
          />
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

        {/* 右側：ルーム情報・QR・プレイヤー一覧・抜けるボタン */}
        {roomCode && (
          <div className="flex items-center space-x-1.5">
            
            {/* ルームコード・コピーボタン */}
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 px-2 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-200/80"
              title="コードをコピーするよ"
            >
              <span className="text-slate-400 font-normal">CODE:</span>
              <span className="tracking-wider text-blue-600 font-mono font-extrabold">{roomCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* QRコードボタン */}
            <button
              onClick={onOpenQR}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
              title="招待QRコードを見せるよ"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* プレイヤー数ボタン */}
            <button
              onClick={() => setShowPlayersList(!showPlayersList)}
              className="flex items-center space-x-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-200/60"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{players.length}人</span>
            </button>

            {/* 部屋を抜けるボタン */}
            <button
              onClick={handleLeaveClick}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              title="部屋を抜けるよ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* プレイヤー一覧ドロップダウン/モーダル */}
      {showPlayersList && (
        <div className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 animate-pop">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> 参加メンバー ({players.length}名)
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
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded font-bold">君</span>
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
