import { useState, useEffect } from 'react';
import { Trophy, Clock, Play, RotateCcw, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { questions } from './data/questions';
import { GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQIndex(0);
    setScore(0);
    setTimeLeft(600);
    setSelectedOption(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || isTransitioning) return;
    
    setSelectedOption(index);
    setIsTransitioning(true);
    
    const isCorrect = index === questions[currentQIndex].a;
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      } else {
        setGameState('finished');
      }
    }, 600); // Quick transition for 100 questions
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getRank = (finalScore: number) => {
    if (finalScore === 100) return { title: "أسطورة كرة القدم", color: "text-yellow-400" };
    if (finalScore >= 85) return { title: "خبير كروي", color: "text-emerald-400" };
    if (finalScore >= 60) return { title: "محترف", color: "text-blue-400" };
    if (finalScore >= 40) return { title: "متابع جيد", color: "text-orange-400" };
    return { title: "هاوي", color: "text-gray-400" };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-hidden selection:bg-emerald-200" dir="rtl">
      
      {/* Header Navigation */}
      <header className="bg-emerald-600 text-white p-4 md:p-6 flex flex-wrap justify-between items-center shadow-lg gap-4 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-full">
            <Trophy className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter">تحدي أساطير الكرة</h1>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex gap-4 md:gap-8 items-center flex-wrap">
            <div className={`px-4 md:px-6 py-2 rounded-2xl flex items-center gap-3 border shadow-inner transition-colors ${timeLeft < 60 ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-emerald-700 border-white/20'}`}>
              <span className="text-xs md:text-sm opacity-80 font-bold hidden sm:inline">الوقت المتبقي</span>
              <span className="text-xl md:text-2xl font-mono font-bold tracking-widest flex items-center gap-2">
                <Clock className="w-5 h-5 sm:hidden" />
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="bg-amber-400 text-emerald-900 px-4 py-2 rounded-xl font-black shadow-sm text-sm md:text-base">
              السؤال {currentQIndex + 1} / {questions.length}
            </div>
          </div>
        )}
      </header>

      {/* START SCREEN */}
      {gameState === 'start' && (
        <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-10 bg-slate-50 overflow-y-auto">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-[40px] shadow-2xl border-b-[8px] border-slate-200 flex items-center justify-center animate-bounce">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
          </div>
          <div className="space-y-6 max-w-2xl bg-white p-8 md:p-12 rounded-[40px] shadow-xl border-b-[12px] border-slate-200">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">هل أنت مستعد للتحدي؟</h2>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-semibold">
              اختبر معلوماتك الكروية في 100 سؤال تغطي كؤوس العالم، دوري أبطال أوروبا، أساطير اللعبة، وقوانينها. لديك <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">10 دقائق فقط</span> لإكمال التحدي.
            </p>
            <button 
              onClick={startGame}
              className="mt-8 group relative inline-flex justify-center items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl md:text-2xl px-10 py-5 rounded-2xl shadow-[0_8px_0_0_#059669] hover:translate-y-[-2px] transition-transform active:translate-y-[4px] active:shadow-[0_4px_0_0_#059669] overflow-hidden w-full sm:w-auto"
            >
              <Play className="w-8 h-8 relative z-10 fill-current" />
              <span className="relative z-10">ابدأ الاختبار الآن</span>
            </button>
          </div>
        </main>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && (
        <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 md:gap-8 items-center justify-start overflow-y-auto w-full max-w-5xl mx-auto">
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner mt-4 md:mt-0">
            <div 
              className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-b-[8px] md:border-b-[12px] border-slate-200 p-8 md:p-12 text-center relative">
            <div className="absolute top-4 left-6 flex flex-col items-center">
               <span className="text-xs text-slate-400 font-bold uppercase mb-1">النقاط</span>
               <span className="text-xl md:text-2xl font-black text-amber-500">{score}</span>
            </div>

            {currentQIndex < 20 && <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">كؤوس العالم</span>}
            {currentQIndex >= 20 && currentQIndex < 40 && <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">دوري أبطال أوروبا</span>}
            {currentQIndex >= 40 && currentQIndex < 60 && <span className="inline-block px-4 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">الدوريات المحلية</span>}
            {currentQIndex >= 60 && currentQIndex < 80 && <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">أساطير وجوائز</span>}
            {currentQIndex >= 80 && <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">قوانين ومعلومات</span>}

            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 leading-snug md:leading-tight mb-4 mt-2">
              {questions[currentQIndex].q}
            </h2>
            <p className="text-slate-400 text-base md:text-lg">اختر إجابة واحدة من الخيارات المتاحة أدناه</p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full pb-8">
            {questions[currentQIndex].o.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectAnswer = index === questions[currentQIndex].a;
              const optionLetters = ['أ', 'ب', 'ج', 'د'];
              
              let cardClass = "bg-white border-4 border-slate-200 hover:border-emerald-400 p-4 md:p-6 rounded-[24px] md:rounded-[28px] flex items-center gap-4 md:gap-6 cursor-pointer group transition-all shadow-sm";
              let letterClass = "w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg md:text-xl font-bold text-slate-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0";
              let textClass = "text-xl md:text-2xl font-bold text-slate-700";
              
              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  cardClass = "bg-emerald-50 border-4 border-emerald-500 p-4 md:p-6 rounded-[24px] md:rounded-[28px] flex items-center gap-4 md:gap-6 shadow-[0_8px_0_0_#10b981] scale-[1.02] z-10 transition-all";
                  letterClass = "w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500 flex items-center justify-center text-lg md:text-xl font-bold text-white shrink-0";
                  textClass = "text-xl md:text-2xl font-bold text-emerald-900";
                } else if (isSelected) {
                  cardClass = "bg-red-50 border-4 border-red-500 p-4 md:p-6 rounded-[24px] md:rounded-[28px] flex items-center gap-4 md:gap-6 shadow-[0_8px_0_0_#ef4444] transition-all";
                  letterClass = "w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 flex items-center justify-center text-lg md:text-xl font-bold text-white shrink-0";
                  textClass = "text-xl md:text-2xl font-bold text-red-900 line-through decoration-red-300 decoration-2 opacity-80";
                } else {
                  cardClass = "bg-white border-4 border-slate-100 p-4 md:p-6 rounded-[24px] md:rounded-[28px] flex items-center gap-4 md:gap-6 opacity-50 grayscale transition-all";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                  className={`text-right w-full ${cardClass}`}
                >
                  <div className={letterClass}>{optionLetters[index]}</div>
                  <span className={textClass}>{option}</span>
                  
                  {/* Status Icons for Correct/Incorrect */}
                  {selectedOption !== null && isCorrectAnswer && (
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 mr-auto animate-bounce shrink-0" />
                  )}
                  {selectedOption === index && !isCorrectAnswer && (
                    <XCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500 mr-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* FINISHED SCREEN */}
      {gameState === 'finished' && (
        <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-8 bg-slate-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border-b-[12px] border-slate-200 p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-500 mb-6 relative z-10">النتيجة النهائية</h2>
            
            <div className="flex justify-center items-baseline gap-2 mb-8 relative z-10">
              <span className="text-8xl md:text-9xl font-black text-emerald-600 tracking-tighter">{score}</span>
              <span className="text-4xl md:text-5xl font-bold text-slate-300">/100</span>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 relative z-10">
              <p className="text-lg text-slate-500 mb-2 font-bold">اللقب الذي تستحقه</p>
              <p className={`text-4xl md:text-5xl font-black ${getRank(score).color}`}>
                {getRank(score).title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-8 relative z-10">
              <div className="bg-white border-2 border-emerald-100 p-4 rounded-[20px] shadow-sm">
                <p className="text-slate-400 text-sm md:text-base font-bold mb-1">الإجابات الصحيحة</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-600">{score}</p>
              </div>
              <div className="bg-white border-2 border-amber-100 p-4 rounded-[20px] shadow-sm">
                <p className="text-slate-400 text-sm md:text-base font-bold mb-1">الوقت المتبقي</p>
                <p className="text-2xl md:text-3xl font-black text-amber-500 font-mono">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="group relative inline-flex justify-center items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xl px-10 py-5 rounded-2xl shadow-[0_6px_0_0_#1e293b] hover:translate-y-[-2px] transition-transform active:translate-y-[4px] active:shadow-none w-full sm:w-auto relative z-10"
            >
              <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </main>
      )}

    </div>
  );
}
