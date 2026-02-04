import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(62, 39, 35, 0.9)', // Marrom café profundo com transparência
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: '#FFFBEB', // Um off-white levemente amarelado (creme)
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700', // Borda dourada para dar destaque à "moeda"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  titleRow: {
    alignItems: "center", 
    justifyContent: 'center',  
    marginBottom: 16,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 12,
    // Se o ícone for uma moeda, um leve drop shadow fica top
    shadowColor: '#5D4037',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '900', 
    textAlign: 'center',
    color: '#5D4037', // Marrom escuro
    textTransform: 'uppercase',
  },
  msg: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#795548', // Marrom médio
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  btnUpArea: {
    width: '100%',
    alignItems: 'center',    
  },
  btnUpdate: { 
    backgroundColor: '#FFD700', // Dourado moeda
    borderRadius: 15, 
    paddingVertical: 15, 
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#B8860B', // Sombra do botão (efeito 3D)
  },
  btnText: { 
    color: '#3E2723', // Marrom quase preto para contraste no botão
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  // ... estilos anteriores

  btnLater: {
    marginTop: 12,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnLaterText: {
    color: '#795548', // Marrom médio para não competir com o dourado
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline', // Dá um toque de link
  },
});