import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import AllScreen from '../components/Chat/AllScreen';
import CommunityScreen from '../components/Chat/CommunityScreen';
import EventScreen from '../components/Chat/EventScreen';
import SurveyScreen from '../components/Chat/SurveyScreen';

const ChatScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'FAQs' },
    { key: 'community', title: 'Community' },
    { key: 'event', title: 'Event' },
    { key: 'survey', title: 'Survey' },
  ]);

  const renderScene = SceneMap({
    all: AllScreen,
    community: CommunityScreen,
    event: EventScreen,
    survey: SurveyScreen,
  });

  const renderTabBar = (props) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isFocused = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.tabItem,
              isFocused ? styles.tabItemActive : styles.tabItemInactive,
            ]}
            onPress={() => setIndex(i)}
          >
            <Text
              style={[
                styles.tabTitle,
                { color: isFocused ? '#ffffff' : '#6200ea' },
              ]}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  tabItemActive: {
    backgroundColor: '#1F509A',
  },
  tabItemInactive: {
    backgroundColor: '#f5f5f5',
    borderColor: '#1F509A',
    borderWidth: 1,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
