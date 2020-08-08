import React, { useState } from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'
import { TextInput, TouchableNativeFeedback} from 'react-native-gesture-handler'

import {styles, color} from '../Extra/styles'
import { authSignUp } from '../store/actions/auth'
import { useDispatch } from 'react-redux'

export default function SignUp(props) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')

    const dispatch = useDispatch()

    const onSignUp = async () => {
        if(!name){
            Alert.alert('Error !', 'Name field is required.', [{title: 'Okay'}])
            return
        }
        if(!phone){
            Alert.alert('Error !', 'Phone field is required.', [{title: 'Okay'}])
            return
        }
        if(!email){
            Alert.alert('Error !', 'Email field is required.', [{title: 'Okay'}])
            return
        }
        if(!password){
            Alert.alert('Error !', 'Password field is required.', [{title: 'Okay'}])
            return
        }
        if(!password === cPassword){
            Alert.alert('Error !', 'Password doesn\'t match.', [{title: 'Okay'}])
            return
        }
        try{
            await dispatch(authSignUp({
                user: {email, password, returnSecureToken:true},
                data: {name, phone}
            }))
        }catch(err){
            Alert.alert('Error !', err.message, [{title: 'Okay'}])
            return
        }
        
        props.navigation.navigate("Settings")
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{width:'100%', alignItems:'center', justifyContent:'center', flex:1}}>
            <Text style={{...styles.title, marginBottom: 20}}>Create new account</Text>
            <View style={{width:'100%', justifyContent:'center', alignItems: 'center'}}>   
                <View>
                    <TextInput style={styles.textInput} 
                        placeholder='Enter name....'
                        value={name}
                        onChangeText={text => setName(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Enter phone no....'
                        value={phone}
                        onChangeText={text => setPhone(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Enter email....'
                        value={email}
                        onChangeText={text => setEmail(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Enter password....'
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Confirm password....'
                        value={cPassword}
                        secureTextEntry={true}
                        onChangeText={text => setCPassword(text)} />
                </View>
                <TouchableNativeFeedback style={styles.buttonContainer} 
                    onPress={()=> onSignUp() }>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 20}}>
                <Text>Already an user ? </Text>
                <TouchableOpacity onPress={()=> props.navigation.replace('Login')}>
                    <Text style={{color: color.primary}}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}
