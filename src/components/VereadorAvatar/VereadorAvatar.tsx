import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

interface VereadorAvatarProps {
  vereador: {
    name: string;
    profilePhoto?: string;
  };
  size?: number;
  showName?: boolean;
  style?: any;
}

export const VereadorAvatar: React.FC<VereadorAvatarProps> = ({
  vereador,
  size = 100,
  showName = false,
  style
}) => {
  const avatarSize = size;
  const fontSize = Math.max(12, size * 0.4);

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={vereador?.profilePhoto ? { uri: vereador.profilePhoto } : require('../../../assets/default-avatar.png')}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 8,
          }
        ]}
        defaultSource={require('../../../assets/default-avatar.png')}
        onError={() => {
          console.log('Erro ao carregar imagem do perfil, usando padrão');
        }}
      />
      {showName && (
        <Text style={[styles.name, { fontSize }]} numberOfLines={1}>
          {vereador.name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 2,
    borderColor: colors.slate[700],
  },
  name: {
    color: colors.slate[100],
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
