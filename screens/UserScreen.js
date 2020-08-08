import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { Text, View, StyleSheet, Button, Image, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { AntDesign, Feather } from '@expo/vector-icons';
import { logout, getProfile } from '../store/actions/auth';

export default function UserScreen(props){

    const user = useSelector(state => state.auth)

    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()

    useEffect(()=>{
        const get = async (id) => {
        try{ 
            setIsLoading(true)
            await dispatch(getProfile(id))
            setIsLoading(false)
        }catch(err){
            Alert.alert('Error !', err.message, [{title: 'Okay'}])
            setIsLoading(false)
            return
        }
        }
        get(user.id)
    }, [])

    if(isLoading){
        return(
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
        <View style={styles.box}>
            <View style={{width: '100%', alignItems: 'center'}}>
                <View style={styles.dpContainer}>
                    {user.image 
                    ? <Image style={styles.dp} source={{uri: user.image}}/>
                    : <Image style={styles.dp} source={require('../assets/user.png')}/>}
                </View>
            </View>
            {user.id
                ? <Text style={styles.name}>{user.name}</Text>
                : <View style={{alignItems: 'center', justifyContent:'space-between', paddingVertical: 10}}> 
                    <Text style={{marginBottom: 10}}>Already an user ?</Text>
                    <Button title='Log in' onPress={()=>props.navigation.navigate('Login')} />
                    <Text style={{marginVertical: 10}}>New user ?</Text>
                    <Button title='Sign Up' onPress={()=>props.navigation.navigate('SignUp')} />
                </View>
            }
        </View>
        {user.id  
            ? <View style={styles.optionContainer}>
                <TouchableOpacity onPress={() => props.navigation.navigate('UpdateProfile')}>
                    <View style={styles.option}>
                        <Text style={styles.optionItem}>Update Profile</Text>
                        <AntDesign name='rightcircleo' size={15} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate("Contacts")}>
                    <View style={styles.option}>
                        <Text style={styles.optionItem}>Contacts</Text>
                        <AntDesign name='rightcircleo' size={15} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(logout())}>
                    <View style={styles.option}>
                        <Text style={{...styles.optionItem, color: 'red'}}>Logout</Text>
                        <AntDesign name='logout' size={15} color="red" />
                    </View>
                </TouchableOpacity>
            </View>
            : null}
        </View>
    )
}

const {height, width} = Dimensions.get('window')

const imgWidth = width > 500 ? 300 : 200

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      flex: 1
    },
    box: {
        width: '100%',
        // marginBottom: 10,
        paddingVertical: 10,
        // borderBottomWidth: 1,
        alignItems: 'center'
    },
    dpContainer: {
        height: imgWidth,
        width: imgWidth,
        // borderWidth: 3,
        borderRadius: imgWidth/2,
        // borderColor: 'gre',
        overflow: 'hidden',
        marginVertical: 10
    },
    dp : {
        height: '100%',
        width: '100%',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10
    },
    optionContainer: {
        width: '100%',
        // marginBottom: 10,
        
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        // borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    optionItem: {
        fontSize: 15, 
        fontWeight: 'bold', 
        color: 'blue'
    }
  });
  