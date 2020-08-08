import React, { useState, useEffect } from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { TextInput, TouchableNativeFeedback} from 'react-native-gesture-handler'

import {styles, color} from '../Extra/styles'
import { getProfile, updateProfile } from '../store/actions/auth'
import { useDispatch, useSelector } from 'react-redux'
import ImagePicker from './ImagePicker'

export default function Profile(props) {
    
    const user = useSelector(state => state.auth)
    
    const [name, setName] = useState(user.name)
    const [phone, setPhone] = useState(user.phone)
    const [image, setImage] = useState(user.image)

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const onUpdate = async () => {
        setIsLoading(true)
        await dispatch(updateProfile({
            id: user.id,
            data: {name, phone, image}
        }))
        setIsLoading(false)
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
        <View style={{height: '100%', width:'100%', alignItems:'center', justifyContent:'center', flex:1}}>
            <View style={{width:'100%', alignItems: 'center'}}>   
                <View style={{width:'100%', justifyContent:'center', alignItems: 'center'}}>
                    <View style={{height: '60%'}}>
                        <ImagePicker image={image} setImage={setImage} />
                    </View>
                    <TextInput style={styles.textInput} 
                        placeholder='Enter name....'
                        value={name}
                        onChangeText={text => setName(text)} />
                    <TextInput style={styles.textInput} 
                        placeholder='Enter phone no....'
                        value={phone}
                        onChangeText={text => setPhone(text)} />
                </View>
                <TouchableNativeFeedback style={styles.buttonContainer} 
                    onPress={()=> onUpdate() }>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Update</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}
