import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { styles } from './styles'; 

function isVersionLower(current: string, latest: string): boolean {
  const c = current.split('.').map(Number);
  const l = latest.split('.').map(Number);
  for (let i = 0; i < Math.max(c.length, l.length); i++) {
    const a = c[i] || 0;
    const b = l[i] || 0;
    if (a < b) return true;
    if (a > b) return false;
  }
  return false;
}

export function UpdateModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
    try {
        await remoteConfig().fetchAndActivate();
        const latestVersion = remoteConfig().getValue('latest_version').asString();
        const currentVersion = DeviceInfo.getVersion();

        if (latestVersion && isVersionLower(currentVersion, latestVersion)) {
        setShowModal(true);
        }
    } catch (error) {
        console.log('Erro Remote Config:', error);
    }
    };

    checkVersion();
  }, []);

  const handleUpdate = () => {
    const storeUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?'
        : 'https://apps.apple.com/br/app/';
    Linking.openURL(storeUrl);
  };

  return (
    <Modal visible={showModal} transparent animationType="slide"> 
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.titleRow}>
            <Image 
              source={require("../../assets/trono.png")} 
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.title}>Nova Fornada de Moedas!</Text>
          </View>
          
          <Text style={styles.msg}>
            Atualize o app para garantir que seus Cagacoins estejam seguros!
          </Text>   

          <View style={styles.btnUpArea}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={styles.btnUpdate} 
              onPress={handleUpdate}
            >
              <Text style={styles.btnText}>Atualizar agora</Text>
            </TouchableOpacity>   

            <TouchableOpacity 
              activeOpacity={0.6} 
              style={styles.btnLater} 
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.btnLaterText}>Agora não, depois</Text>
            </TouchableOpacity>
          </View>
        </View>       
      </View>
    </Modal>
  );
}