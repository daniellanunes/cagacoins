import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import * as S from './styles'; // Mantemos o Styled Components (ele é de boa!)

const { height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const SplashAnimation: React.FC<Props> = ({ onFinish }) => {
  // Criamos as referências para os valores animados
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequência da "cagada remunerada": pausa -> cai -> finaliza
    Animated.sequence([
      Animated.delay(500), // Pequena pausa para ver a logo
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 800,
          useNativeDriver: true, // Isso garante performance de 60fps
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onFinish()); // Chama a função quando tudo acabar
  }, [onFinish]);

  return (
    <S.Container>
    
      <Animated.Image
        source={require('../../assets/logo.png')}
        resizeMode="contain"
        style={{
          width: 150,
          height: 150,
          opacity: opacity,
          transform: [
            { translateY: translateY },
            { scale: scale }
          ]
        }}
      />
    </S.Container>
  );
};

export default SplashAnimation;