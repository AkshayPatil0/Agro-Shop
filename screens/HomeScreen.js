import React, {useEffect} from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Posts from '../components/Posts';

export default function HomeScreen(props) {

  return (
    <View style={styles.container}>
      <Posts nav={props.navigation} />
    </View>
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
