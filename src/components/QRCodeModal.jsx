import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, X, Share2 } from 'lucide-react';

export default function QRCodeModal({ roomCode, onClose }) {
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // 現在のページのベースURL + roomCode クエリパラメータ
  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;

  useEffect(() => {
    if (roomCode) {
      QRCode.toDataURL(shareUrl, { width: 240, margin: 2 }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [roomCode, shareUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '誰の文章でしょう？ - ゲーム招待',
          text: `【エピソード人狼】一緒に遊ぼう！\nルームコード: ${roomCode}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-800 mb-1">友達を招待する</h3>
        <p className="text-xs text-slate-500 mb-4">スマホのカメラで読み込んでもらうか、URLを共有してください</p>

        {/* QRコード画像 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 inline-block mb-4 shadow-inner">
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">QRコード作成中...</div>
          )}
        </div>

        {/* ルームコード大文字表示 */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ROOM CODE</div>
          <div className="text-2xl font-black font-mono text-blue-600 tracking-wider">{roomCode}</div>
        </div>

        {/* ボタン群 */}
        <div className="space-y-2">
          {navigator.share && (
            <button
              onClick={handleWebShare}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>SNS・LINEで共有する</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-sm border border-slate-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">招待リンクをコピーしました！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>招待リンクをコピー</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
