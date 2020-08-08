import React, { useState, useEffect } from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator} from 'react-native'
import { TextInput, TouchableNativeFeedback} from 'react-native-gesture-handler'
import {useDispatch} from 'react-redux'
import { useSelector } from "react-redux";

import {styles, color} from '../Extra/styles'
import { addPosts } from '../store/actions/posts'
import ImagePicker from '../components/ImagePicker';

export default function Camera(props) {
    const sender = useSelector(state => state.auth)
    const [image, setImg] = useState(null)
    const [description, setDesc] = useState('')
    const [type, setType] = useState('')
    const [location, setLocation] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!sender.id){
            Alert.alert(
                'Login required', 
                'You should be logged in to add new post !!',
                [{text: 'Go to login', onPress: () => props.navigation.navigate('Settings') }, { text: 'Cancel', style: 'cancel'}] 
            )
        }
    }, [dispatch])

    const clear = () => {
        setImg(null)
        setDesc('')
        setType('')
        setLocation('')
    }

    const add =async () => {
        try{
            setIsLoading(true)
            await dispatch(addPosts({sender, description, image, type, location, time: Date.now()}))
            setIsLoading(false)
            clear()
            props.navigation.navigate('Home')
        }catch(err){
            Alert.alert('Error !', err.message, [{title: 'Okay'}])
            setIsLoading(false)
            return
        }
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
        {sender.id 
        ? <View style={{width:'100%', alignItems:'center', justifyContent:'center', flex:1, borderWidth: 1}}>
            <Text style={styles.title}>New Post</Text>
            {/* <ScrollView style={{flex: 1}}> */}
            <View style={{width:'100%', justifyContent:'center', alignItems: 'center'}}>
                <View style={{height: '50%'}}>
                    <ImagePicker image={image} setImage={setImg} />
                </View>
                <View>
                    <TextInput textarea style={styles.textInput} placeholder='Description...' 
                        value={description}  onChangeText={text=> setDesc(text)}/>
                    <TextInput style={styles.textInput} placeholder='Type of product...' 
                        value={type}  onChangeText={text=> setType(text)}/>
                    <TextInput style={styles.textInput} placeholder='Location...' 
                        value={location}  onChangeText={text=> setLocation(text)}/>
                </View>
                <TouchableNativeFeedback style={styles.buttonContainer} 
                    onPress={add}>
                    <View style={styles.button}>
                        <Text style={{...styles.buttonText, fontSize: 20,}}>Post</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            {/* </ScrollView> */}
        </View>
        : <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>You need to login first !!</Text>
        </View> }
        </TouchableWithoutFeedback>
    )
}

