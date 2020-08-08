import React, {useEffect, useState} from 'react';
import { StyleSheet, AsyncStorage, View, ActivityIndicator, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { postReducer } from './store/reducers/posts'
import { authReducer } from './store/reducers/auth'
import { AntDesign, Feather } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import AddPostScreen from './screens/AddPostScreen';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Contacts from './components/Contacts';

import {authenticate} from './store/actions/auth'
import NotificationScreen from './screens/NotificationScreen';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const store = createStore(combineReducers({
  posts: postReducer,
  auth: authReducer,
}), {}, applyMiddleware(ReduxThunk))

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Settings' component={UserScreen} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='UpdateProfile' component={Profile} />
      <Stack.Screen name='Contacts' component={Contacts} />
    </Stack.Navigator>
  )
}

function getTabBarVisibility(route) {
  const routeName = route.state ? route.state.routes[route.state.index].name : '';
  if (routeName === 'Chat') {
    return false;
  }
  return true;
}

function TabNavigator() {
  const user = useSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  useEffect(()=>{
    const checkUser = async () => {
        const userData = await AsyncStorage.getItem('user')
        const user = JSON.parse(userData)
        if(user){
            if(+user.expiry < Date.now()){
                setIsLoading(false)
                return
            }
            else{
                await dispatch(authenticate(user))
                setIsLoading(false)
            }
        }
        else{
          setIsLoading(false)
        }
    }
    setIsLoading(true)
    checkUser()

    return function() {
      setIsLoading(false)
    }
  }, [])

  if(isLoading){
    return(
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <View style={{height: 100, width: 100, marginVertical: 10}}>
            <Image source={require('./assets/icon.png')} style={{height: '100%', width: '100%'}} />
          </View>
          <ActivityIndicator size="small" />
      </View>
    )
  }
  return (
    <Tab.Navigator
      tabBarOptions={{ showLabel: false }}
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Post') {
            iconName = 'plussquareo';
          } else if (route.name === 'Settings') {
            iconName = 'setting';
          }

          return <AntDesign name={iconName} size={size} color={focused ? 'blue' : color} />
        },
        
      })}>
      <Tab.Screen name="Home" component={ChatStack} 
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route)
        })}/>
      <Tab.Screen name="Post" component={AddPostScreen} />
      <Tab.Screen name="Settings" children={SettingStack}
      />
    </Tab.Navigator>
  )
}

function ChatStack() {
  return (
    <Stack.Navigator mode='modal'>
      <Stack.Screen name='Home'
      options={({ navigation, route }) => ({
        headerTitle: "AgroShop",
        headerLeft: () =>
          <View style={{height: 40, width: 40, marginVertical: 5, marginLeft: 10}}>
            <Image source={require('./assets/icon.png')} style={{height: '100%', width: '100%'}}/>
          </View>,
        headerRight: () =>
        <TouchableOpacity style={{ padding: 20 }} onPress={() => { navigation.navigate('Notification') }}>
          <Feather name='bell' size={25}  />
        </TouchableOpacity>

      })
      } 
      component={HomeScreen} />
      <Stack.Screen
        name= 'Notification'
        component={NotificationScreen} />
      {/* <Stack.Screen
        name='Chat'
        options={({ navigation, route }) => ({
          headerTitle: route.params.sender.name,
          headerLeft: () =>
            <TouchableOpacity style={{ padding: 20 }} onPress={() => { navigation.goBack() }}>
              <AntDesign name='leftcircleo' size={30} />
            </TouchableOpacity>,
          headerRight: () =>
            <TouchableOpacity style={{ padding: 20 }} onPress={() => { }}>
              <Feather name='phone-call' size={30} color='green' />
            </TouchableOpacity>,

        })
        }
        component={ChatScreen} /> */}
    </Stack.Navigator>
  )
}

export default function App() {
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
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
