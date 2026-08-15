import React, { useState, useEffect, useRef } from 'react';
import { PeerManager } from './services/peerService';
import Header from './components/Header';
import LobbyPhase from './components/LobbyPhase';
import AnswerPhase from './components/AnswerPhase';
import GuessPhase from './components/GuessPhase';
import ResultPhase from './components/ResultPhase';
import QRCodeModal from './components/QRCodeModal';

export default function App() {
  const peerManagerRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    const pm = new PeerManager();
    peerManagerRef.current = pm;

    pm.onStateUpdate = (newState) => {
      setGameState({ ...newState });
    };

    pm.onError = (errMsg) => {
      setGlobalError(errMsg);
    };

    return () => {
      pm.disconnect();
    };
  }, []);

  const handleCreateRoom = async (playerName, roomCode) => {
    if (!peerManagerRef.current) return;
    try {
      const res = await peerManagerRef.current.createRoom(playerName, roomCode);
      setMyPlayerId(res.playerId);
      setIsHost(true);
    } catch (err) {
      throw err;
    }
  };

  const handleJoinRoom = async (playerName, roomCode) => {
    if (!peerManagerRef.current) return;
    try {
      const res = await peerManagerRef.current.joinRoom(playerName, roomCode);
      setMyPlayerId(res.playerId);
      setIsHost(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateSettings = (topic, timeLimit) => {
    if (!peerManagerRef.current) return;
    if (isHost) {
      peerManagerRef.current.updateSettings(topic, timeLimit);
    } else {
      peerManagerRef.current.updateGuestSettings(topic, timeLimit);
    }
  };

  const handleStartGame = () => {
    if (peerManagerRef.current && isHost) {
      peerManagerRef.current.startAnswerPhase();
    }
  };

  const handleSubmitAnswer = (answer) => {
    if (!peerManagerRef.current) return;
    if (isHost) {
      peerManagerRef.current.submitHostAnswer(answer);
    } else {
      peerManagerRef.current.submitGuestAnswer(answer);
    }
  };

  const handleSubmitVote = (guessedAuthorId) => {
    if (!peerManagerRef.current) return;
    if (isHost) {
      peerManagerRef.current.submitHostVote(guessedAuthorId);
    } else {
      peerManagerRef.current.submitGuestVote(guessedAuthorId);
    }
  };

  const handleNextEpisode = () => {
    if (peerManagerRef.current && isHost) {
      peerManagerRef.current.nextEpisode();
    }
  };

  const handleRestart = () => {
    if (peerManagerRef.current && isHost) {
      peerManagerRef.current.resetToLobby();
    }
  };

  const currentPhase = gameState?.phase || 'LOBBY';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-700">
      
      {/* ヘッダー */}
      <Header
        gameState={gameState}
        myPlayerId={myPlayerId}
        onOpenQR={() => setShowQRModal(true)}
      />

      {/* エラー通知 */}
      {globalError && (
        <div className="bg-rose-600 text-white text-xs font-bold p-3 text-center flex items-center justify-center space-x-2 shadow-md z-40">
          <span>{globalError}</span>
          <button
            onClick={() => setGlobalError('')}
            className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[10px]"
          >
            閉じる
          </button>
        </div>
      )}

      {/* メインコンテンツエリア */}
      <main className="flex-1 pb-12">
        {currentPhase === 'LOBBY' && (
          <LobbyPhase
            gameState={gameState}
            myPlayerId={myPlayerId}
            isHost={isHost}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartGame={handleStartGame}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentPhase === 'ANSWERING' && (
          <AnswerPhase
            gameState={gameState}
            myPlayerId={myPlayerId}
            onSubmitAnswer={handleSubmitAnswer}
          />
        )}

        {currentPhase === 'GUESSING' && (
          <GuessPhase
            gameState={gameState}
            myPlayerId={myPlayerId}
            isHost={isHost}
            onSubmitVote={handleSubmitVote}
            onNextEpisode={handleNextEpisode}
          />
        )}

        {currentPhase === 'RESULT' && (
          <ResultPhase
            gameState={gameState}
            myPlayerId={myPlayerId}
            isHost={isHost}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* QRコードモーダル */}
      {showQRModal && gameState?.roomCode && (
        <QRCodeModal
          roomCode={gameState.roomCode}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* フッター */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-medium border-t border-slate-200/60 bg-white">
        エピソード人狼 - 誰の文章でしょう？推測ゲーム (自前サーバー不要 / PeerJS)
      </footer>

    </div>
  );
}
