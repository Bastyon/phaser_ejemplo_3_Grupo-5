import Phaser from 'phaser';
import { useState, useEffect } from 'react';
import Escena from './scenes/Escena';
import GameOver from './scenes/GameOver';
import Congratulations from './scenes/Congratulations';

function App() {

  const [listo, setListo] = useState(false);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: [Escena, GameOver, Congratulations]
    };

    // Arranca el juego 
    // A la variable game se le asigna un nuevo objeto de tipo phaser
    const game = new Phaser.Game(config);

    game.events.on("LISTO", setListo);

    return () => {
      setListo(false);
      game.destroy(true);
    }
  }, [listo]);
}

export default App;