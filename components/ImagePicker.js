import React, { useState, useEffect } from 'react'
import { View, Button, Text, StyleSheet, TouchableNativeFeedback, Image } from 'react-native'
import * as imgPicker from 'expo-image-picker'


import {styles, color} from '../Extra/styles'


export default function ImagePicker(props){
    
    const {image, setImage} = props

    const onTake = async () =>{
        const result = await imgPicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.4
            })
        if(!result.cancelled){
            setImage(result.uri)
        }
    }

    const onChoose = async () =>{
        const result = await imgPicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.4
            })
        if(!result.cancelled){
            setImage(result.uri)
        }
    }
    return (
        <View style={{...styles.container, margin: 10}}>
            <View style={{flex: 1, width: '100%', borderWidth: 1,alignItems: 'center', justifyContent: 'center'}}>
                { !props.image ? <Text>Image preview</Text>
                 : <Image source={{uri: image}} style={{height: "100%", width: '100%'}} />}
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableNativeFeedback style={{...styles.buttonContainer, maxHeight: 20, marginHorizontal: 10 }} 
                    onPress={()=> {onTake()}}>
                    <View style={{...styles.button, backgroundColor: 'blue', borderRadius: 50}}>
                        <Text style={styles.buttonText}>Take Photo</Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback style={styles.buttonContainer} 
                    onPress={()=> {onChoose()}}>
                    <View style={{...styles.button, backgroundColor: 'blue', borderRadius: 50}}>
                        <Text style={styles.buttonText}>Choose from gallary</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

// const styles = StyleSheet.create({
//     container: {
//         height: '100%',
//         alignItems: 'center',
//         // justifyContent: 'center'
//     },
//     preview: {
//         // flex: 1
//     }
// })