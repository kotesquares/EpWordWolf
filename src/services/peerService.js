import Peer from 'peerjs';

const PEER_PREFIX = 'ep-wordwolf-room-v1-';

export class PeerManager {
  constructor() {
    this.peer = null;
    this.connections = new Map(); // host: guestPeerId -> DataConnection
    this.hostConnection = null;   // guest: DataConnection to Host
    this.isHost = false;
    this.myPlayerId = null;
    this.roomCode = null;

    this.onStateUpdate = null;
    this.onError = null;
    this.onConnected = null;

    // Room State (Host maintainer)
    this.state = {
      phase: 'LOBBY', // LOBBY, ANSWERING, GUESSING, RESULT
      roomCode: '',
      hostId: '',
      topic: 'もし1おく円が手に入ったら何に使う？',
      timeLimit: 120, // 秒
      timeRemaining: 120,
      timerActive: false,
      players: [], // { id, name, isHost, score, isConnected, avatarColor }
      answers: {}, // playerId -> answerText
      episodeOrder: [], // shuffled playerIds for guessing
      currentEpisodeIndex: 0,
      votes: {}, // episodePlayerId -> { voterPlayerId -> guessedPlayerId }
      scores: {}, // playerId -> { currentRound: 0, total: 0, correctGuesses: 0, trickedOthers: 0 }
    };

    this.timerInterval = null;
  }

  // ルーム作成 (Host)
  createRoom(playerName, roomCode) {
    return new Promise((resolve, reject) => {
      this.isHost = true;
      this.roomCode = roomCode.toUpperCase();
      this.myPlayerId = 'player_' + Math.random().toString(36).substring(2, 9);

      const peerId = PEER_PREFIX + this.roomCode;
      
      try {
        this.peer = new Peer(peerId, {
          debug: 1,
        });

        this.peer.on('open', (id) => {
          console.log('Host Peer opened:', id);
          const hostPlayer = {
            id: this.myPlayerId,
            name: playerName,
            isHost: true,
            score: 0,
            isConnected: true,
            avatarColor: getRandomColor(),
          };

          this.state.roomCode = this.roomCode;
          this.state.hostId = this.myPlayerId;
          this.state.players = [hostPlayer];
          this.state.scores[this.myPlayerId] = { total: 0, currentRound: 0, correctGuesses: 0, trickedOthers: 0 };

          this.setupHostListeners();
          this.broadcastState();
          resolve({ roomCode: this.roomCode, playerId: this.myPlayerId });
        });

        this.peer.on('error', (err) => {
          console.error('Peer error on host:', err);
          if (err.type === 'unavailable-id') {
            reject(new Error('このへやコードはもうつかわれているよ！別のコードをためしてね。'));
          } else {
            reject(new Error('通信エラーがおきたよ: ' + err.message));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // ルーム参加 (Guest)
  joinRoom(playerName, roomCode) {
    return new Promise((resolve, reject) => {
      this.isHost = false;
      this.roomCode = roomCode.toUpperCase();
      this.myPlayerId = 'player_' + Math.random().toString(36).substring(2, 9);

      const guestPeerId = 'guest_' + this.myPlayerId;
      const targetHostPeerId = PEER_PREFIX + this.roomCode;

      try {
        this.peer = new Peer(guestPeerId, { debug: 1 });

        this.peer.on('open', () => {
          console.log('Guest Peer opened. Connecting to host:', targetHostPeerId);
          const conn = this.peer.connect(targetHostPeerId, {
            reliable: true,
          });

          this.hostConnection = conn;

          conn.on('open', () => {
            console.log('Connected to host!');
            // ホストへ参加リクエストを送信
            conn.send({
              type: 'JOIN',
              player: {
                id: this.myPlayerId,
                name: playerName,
                isHost: false,
                score: 0,
                isConnected: true,
                avatarColor: getRandomColor(),
              },
            });

            this.setupGuestListeners(conn);
            resolve({ roomCode: this.roomCode, playerId: this.myPlayerId });
          });

          conn.on('error', (err) => {
            reject(new Error('ホストにつながらなかったよ: ' + err.message));
          });
          
          setTimeout(() => {
            if (!conn.open) {
              reject(new Error('へやが見つからないか、ホストがへんじしないよ。へやコードをたしかめてね！'));
            }
          }, 8000);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error on guest:', err);
          reject(new Error('へやへ接続できなかったよ: ' + err.message));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // --- HOST LISTENERS & STATE MANAGERS ---
  setupHostListeners() {
    this.peer.on('connection', (conn) => {
      console.log('Incoming connection from guest:', conn.peer);
      
      conn.on('data', (data) => {
        this.handleGuestMessage(conn, data);
      });

      conn.on('close', () => {
        console.log('Guest connection closed:', conn.peer);
        this.handleGuestDisconnect(conn.peer);
      });
    });
  }

  handleGuestMessage(conn, data) {
    if (!this.isHost) return;

    switch (data.type) {
      case 'JOIN': {
        const newPlayer = data.player;
        this.connections.set(newPlayer.id, conn);

        // 既存プレイヤー名と重複があるかチェックして回避
        let finalName = newPlayer.name;
        let count = 1;
        while (this.state.players.some(p => p.name === finalName && p.id !== newPlayer.id)) {
          count++;
          finalName = `${newPlayer.name}(${count})`;
        }
        newPlayer.name = finalName;

        // 重複なしで追加
        if (!this.state.players.some(p => p.id === newPlayer.id)) {
          this.state.players.push(newPlayer);
          if (!this.state.scores[newPlayer.id]) {
            this.state.scores[newPlayer.id] = { total: 0, currentRound: 0, correctGuesses: 0, trickedOthers: 0 };
          }
        }
        this.broadcastState();
        break;
      }

      case 'SUBMIT_ANSWER': {
        const { playerId, answer } = data;
        this.state.answers[playerId] = answer;
        this.broadcastState();

        // 全員送信完了しても自動遷移せず、ホストの「お題の回答をみる」操作や手動進行を待つ
        break;
      }

      case 'SUBMIT_VOTE': {
        const { voterId, episodeAuthorId, guessedAuthorId } = data;
        if (!this.state.votes[episodeAuthorId]) {
          this.state.votes[episodeAuthorId] = {};
        }
        this.state.votes[episodeAuthorId][voterId] = guessedAuthorId;
        // 全員完了しても自動遷移せず同期のみ
        this.broadcastState();
        break;
      }

      case 'UPDATE_SETTINGS': {
        const { topic, timeLimit } = data;
        if (topic !== undefined) this.state.topic = topic;
        if (timeLimit !== undefined) {
          this.state.timeLimit = timeLimit;
          this.state.timeRemaining = timeLimit;
        }
        this.broadcastState();
        break;
      }

      default:
        break;
    }
  }

  handleGuestDisconnect(peerId) {
    for (const [playerId, conn] of this.connections.entries()) {
      if (conn.peer === peerId) {
        const player = this.state.players.find(p => p.id === playerId);
        if (player) {
          player.isConnected = false;
        }
        this.connections.delete(playerId);
        break;
      }
    }
    this.broadcastState();
  }

  // --- HOST GAME CONTROLS ---

  updateSettings(topic, timeLimit) {
    if (!this.isHost) return;
    this.state.topic = topic;
    this.state.timeLimit = timeLimit;
    this.state.timeRemaining = timeLimit;
    this.broadcastState();
  }

  startAnswerPhase() {
    if (!this.isHost) return;
    this.state.phase = 'ANSWERING';
    this.state.answers = {};
    this.state.votes = {};
    this.state.currentEpisodeIndex = 0;
    this.state.timeRemaining = this.state.timeLimit;
    
    // 制限時間は目安！0秒になっても何もしない
    this.startTimer(null);

    this.broadcastState();
  }

  // 匿名回答を入力（Host自身用）
  submitHostAnswer(answer) {
    if (!this.isHost) return;
    this.state.answers[this.myPlayerId] = answer;
    this.broadcastState();
  }

  startGuessPhase() {
    if (!this.isHost) return;
    this.stopTimer();

    const answeredPlayerIds = Object.keys(this.state.answers);
    if (answeredPlayerIds.length === 0) {
      alert('だれもかいとうを書いていないよ！');
      this.state.phase = 'LOBBY';
      this.broadcastState();
      return;
    }

    // 集まった回答の中からランダムに1つだけをピックアップ選出
    const randomAuthorId = answeredPlayerIds[Math.floor(Math.random() * answeredPlayerIds.length)];
    this.state.episodeOrder = [randomAuthorId];
    this.state.currentEpisodeIndex = 0;
    this.state.phase = 'GUESSING';
    this.state.votes = {};
    this.state.timeRemaining = 60;

    // 制限時間は目安！0秒になっても何もしない
    this.startTimer(null);

    this.broadcastState();
  }

  // 投票入力（Host自身用）
  submitHostVote(guessedAuthorId) {
    if (!this.isHost) return;
    const currentAuthorId = this.state.episodeOrder[0];
    if (!this.state.votes[currentAuthorId]) {
      this.state.votes[currentAuthorId] = {};
    }
    this.state.votes[currentAuthorId][this.myPlayerId] = guessedAuthorId;
    this.broadcastState();
  }

  // 手動で結果発表へ進む (Host操作)
  nextEpisode() {
    if (!this.isHost) return;
    this.stopTimer();
    this.calculateScoresAndFinish();
  }

  calculateScoresAndFinish() {
    this.state.phase = 'RESULT';
    
    const players = this.state.players;
    const votes = this.state.votes;

    players.forEach(p => {
      if (!this.state.scores[p.id]) {
        this.state.scores[p.id] = { total: 0, currentRound: 0, correctGuesses: 0, trickedOthers: 0 };
      }
      this.state.scores[p.id].currentRound = 0;
      this.state.scores[p.id].roundCorrect = 0;
      this.state.scores[p.id].roundTricked = 0;
    });

    Object.keys(votes).forEach(authorId => {
      const episodeVotes = votes[authorId] || {};
      let totalOtherVoters = 0;
      let correctCount = 0;

      Object.entries(episodeVotes).forEach(([voterId, guessedId]) => {
        if (guessedId === authorId) {
          if (this.state.scores[voterId]) {
            this.state.scores[voterId].currentRound += 100;
            this.state.scores[voterId].correctGuesses += 1;
            this.state.scores[voterId].roundCorrect = (this.state.scores[voterId].roundCorrect || 0) + 1;
          }
          if (voterId !== authorId) {
            correctCount++;
          }
        } else {
          if (voterId !== authorId && this.state.scores[authorId]) {
            this.state.scores[authorId].currentRound += 50;
            this.state.scores[authorId].trickedOthers += 1;
            this.state.scores[authorId].roundTricked = (this.state.scores[authorId].roundTricked || 0) + 1;
          }
        }

        if (voterId !== authorId) {
          totalOtherVoters++;
        }
      });

      if (totalOtherVoters > 0 && correctCount === 0 && this.state.scores[authorId]) {
        this.state.scores[authorId].currentRound += 100;
      }
    });

    players.forEach(p => {
      const s = this.state.scores[p.id];
      if (s) {
        s.total += s.currentRound;
        p.score = s.total;
      }
    });

    this.broadcastState();
  }

  // 再戦・お題を変えてスタート (Host)
  resetToLobby() {
    if (!this.isHost) return;
    this.stopTimer();
    this.state.phase = 'LOBBY';
    this.state.answers = {};
    this.state.votes = {};
    this.state.currentEpisodeIndex = 0;
    this.broadcastState();
  }

  // --- GUEST ACTIONS ---

  submitGuestAnswer(answer) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send({
        type: 'SUBMIT_ANSWER',
        playerId: this.myPlayerId,
        answer,
      });
    }
  }

  submitGuestVote(guessedAuthorId) {
    if (this.hostConnection && this.hostConnection.open) {
      const currentAuthorId = this.state.episodeOrder[0];
      this.hostConnection.send({
        type: 'SUBMIT_VOTE',
        voterId: this.myPlayerId,
        episodeAuthorId: currentAuthorId,
        guessedAuthorId,
      });
    }
  }

  updateGuestSettings(topic, timeLimit) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send({
        type: 'UPDATE_SETTINGS',
        topic,
        timeLimit,
      });
    }
  }

  // --- GUEST LISTENERS ---

  setupGuestListeners(conn) {
    conn.on('data', (data) => {
      if (data.type === 'BROADCAST_STATE') {
        this.state = data.state;
        if (this.onStateUpdate) {
          this.onStateUpdate(this.state);
        }
      }
    });

    conn.on('close', () => {
      console.log('Host connection closed');
      if (this.onError) {
        this.onError('ホストとの接続が切れたよ！');
      }
    });
  }

  // --- HELPERS ---

  startTimer(onTimeout) {
    this.stopTimer();
    this.state.timerActive = true;
    this.timerInterval = setInterval(() => {
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 1;
        this.broadcastState();
      } else {
        // 0秒になっても何もしない（目安タイマー）
        this.stopTimer();
        this.broadcastState();
        if (onTimeout) onTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.state.timerActive = false;
  }

  broadcastState() {
    if (this.onStateUpdate) {
      this.onStateUpdate({ ...this.state });
    }

    if (!this.isHost) return;

    for (const conn of this.connections.values()) {
      if (conn.open) {
        conn.send({
          type: 'BROADCAST_STATE',
          state: this.state,
        });
      }
    }
  }

  disconnect() {
    this.stopTimer();
    if (this.peer) {
      this.peer.destroy();
    }
    this.state = {
      phase: 'LOBBY',
      roomCode: '',
      hostId: '',
      topic: 'もし1おく円が手に入ったら何に使う？',
      timeLimit: 120,
      timeRemaining: 120,
      timerActive: false,
      players: [],
      answers: {},
      episodeOrder: [],
      currentEpisodeIndex: 0,
      votes: {},
      scores: {},
    };
  }
}

// ユーティリティ
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 
  'bg-rose-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
];

function getRandomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}
