import React, { useState } from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { TextInput, TouchableNativeFeedback} from 'react-native-gesture-handler'

import {styles, color} from '../Extra/styles'
import { useDispatch } from 'react-redux'
import { authLogin } from '../store/actions/auth'

export default function Login(props) {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const onLogin = async () => {
        if(!email){
            Alert.alert('Error !', 'Email field is required.', [{title: 'Okay'}])
            return
        }
        if(!password){
            Alert.alert('Error !', 'Password field is required.', [{title: 'Okay'}])
            return
        }
        try{
            setIsLoading(true)
            await dispatch(authLogin({email, password, returnSecureToken:true}))
            setIsLoading(false)
        }catch(err){
            Alert.alert('Error !', err.message, [{title: 'Okay'}])
            setIsLoading(false)
            return
        }
        props.navigation.navigate("Settings")
    }

    if(isLoading){
        return(
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{width:'100%', alignItems:'center', justifyContent:'center', flex:1}}>
            <Text style={{...styles.title, marginBottom: 20}}>Login to your account</Text>
            <View style={{width:'100%', justifyContent:'center', alignItems: 'center'}}>   
                <View>
                    <TextInput style={styles.textInput} 
                        placeholder='Enter email....'
                        value={email}
                        onChangeText={text => setEmail(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Enter password....'
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)} />
                </View>
                <TouchableNativeFeedback style={styles.buttonContainer} onPress={()=> onLogin()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 20}}>
                <Text>New user ? </Text>
                <TouchableOpacity onPress={()=> props.navigation.replace('SignUp')}>
                    <Text style={{color: color.primary}}>Create new account</Text>
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}
