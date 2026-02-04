export type RootStackParamList = {
  Login: undefined;
  Register: undefined;

  Setup: undefined;
  Home: undefined;
  History: undefined;
  Profile: undefined;
  
  // Rota para a lista de jogos disponíveis
  GameGallery: undefined; 
  
  // Rota para abrir o jogo escolhido, passando a URL e o título
  GameView: { 
    url: string; 
    title: string; 
  };

  SessionDetail: {
    session: any;
  };
};