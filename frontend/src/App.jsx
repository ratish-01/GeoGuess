import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import MapBoard from './components/MapBoard';
import StreetFrame from './components/StreetFrame';
import DashboardHUD from './components/DashboardHUD';
import Compass from './components/Compass';
import StartScreen from './components/StartScreen';
import ResultModal from './components/ResultModal';
import SummaryScreen from './components/SummaryScreen';
import TopHintBar from './components/TopHintBar';

const GameContent = () => {
  const { gameStage } = useGame();

  return (
    <Layout>
      <MapBoard />
      <StreetFrame />
      <DashboardHUD />

      {gameStage === 'start' && <StartScreen />}
      {gameStage === 'result' && <ResultModal />}
      {gameStage === 'summary' && <SummaryScreen />}
      <TopHintBar />
    </Layout>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
