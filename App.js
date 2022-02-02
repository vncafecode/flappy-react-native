import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import Bird from './components/Bird';
import Obstacles from './components/Obstacles';

export default function App() {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const birdLeft = screenWidth / 2;
  const [birdBottom, setBirdBottom] = useState(screenHeight / 2);
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth);
  const [obstaclesLeft2, setObstaclesLeft2] = useState(screenWidth + screenWidth / 2 + 30);
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(20);
  const [obstaclesNegHeight2, setObstaclesNegHeight2] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const gravity = 4;
  const obstaclesWidth = 60;
  const obstaclesHeight = 300;
  const gap = 200;
  let gameTimerId;

  useEffect(() => {
    if (birdBottom > 0) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity);
      }, 30);
    }

    return () => {
      clearInterval(gameTimerId);
    }
  }, [birdBottom]);

  // 1st obstacles
  let obstaclesLeftTimerId;
  useEffect(() => {
    if (obstaclesLeft > -obstaclesWidth) {
      obstaclesLeftTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5);
      }, 30);

      return () => {
        clearInterval(obstaclesLeftTimerId);
      }
    } else {
      setObstaclesLeft(screenWidth);
      setObstaclesNegHeight(- Math.random() * 100);
    }
  }, [obstaclesLeft]);

  // 2nd obstacles
  let obstaclesLeftTimerId2;
  useEffect(() => {
    if (obstaclesLeft2 > -obstaclesWidth) {
      obstaclesLeftTimerId2 = setInterval(() => {
        setObstaclesLeft2(obstaclesLeft2 => obstaclesLeft2 - 5);
      }, 30);

      return () => {
        clearInterval(obstaclesLeftTimerId2);
      }
    } else {
      setObstaclesLeft2(screenWidth);
      setObstaclesNegHeight2(- Math.random() * 100)
    }
  }, [obstaclesLeft2]);

  // check for collisions
  useEffect(() => {
    if (
      isHitVertically(obstaclesNegHeight) && isHitHorizontally(obstaclesLeft)
      ||
      isHitVertically(obstaclesNegHeight2) && isHitHorizontally(obstaclesLeft2)
    ) {
      gameOver();
    }
  });

  const isHitVertically = negHeight => {
    return (
      birdBottom < (obstaclesHeight + negHeight)
      ||
      (birdBottom + 60) > (obstaclesHeight + negHeight + gap)
    );
  }

  const isHitHorizontally = obstaclesLeft => {
    return obstaclesLeft > screenWidth / 2 - 30 && obstaclesLeft < screenWidth / 2 + 30;
  }

  const gameOver = () => {
    console.log('game over');
    setIsGameOver(true);

    clearInterval(gameTimerId);
    clearInterval(obstaclesLeftTimerId);
    clearInterval(obstaclesLeftTimerId2);
  }

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <Bird
          birdBottom={birdBottom}
          birdLeft={birdLeft}
        />

        <Obstacles
          color={'crimson'}
          obstaclesLeft={obstaclesLeft}
          obstaclesHeight={obstaclesHeight}
          obstaclesWidth={obstaclesWidth}
          randomBottom={obstaclesNegHeight}
          gap={gap}
        />

        <Obstacles
          color={'green'}
          obstaclesLeft={obstaclesLeft2}
          obstaclesHeight={obstaclesHeight}
          obstaclesWidth={obstaclesWidth}
          randomBottom={obstaclesNegHeight2}
          gap={gap}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
