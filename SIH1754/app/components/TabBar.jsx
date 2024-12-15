import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = '#007bff';
  const greyColor = '#737373';

  const icons = {
    Home: (props) => <AntDesign name="home" size={26} {...props} />,
    Data: (props) => <AntDesign name="pluscircleo" size={26} {...props} />,
    Community: (props) => <Feather name="compass" size={26} {...props} />,
    Profile: (props) => <AntDesign name="user" size={26} {...props} />,
    Bsrs: (props) => <MaterialCommunityIcons  name="google-analytics" size={24} color="black" {...props} />,
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconProps = {
          color: isFocused ? primaryColor : greyColor,
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name](iconProps)}
            <Text
              style={{
                color: isFocused ? primaryColor : greyColor,
                fontSize: 11,
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBar;
