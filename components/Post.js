import React, { useState } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Alert } from 'react-native'

import call from 'react-native-phone-call'

import { Feather } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { addContact, deleteContact } from '../store/actions/auth'

const Post = props => {
    const [showDesc, setShowDesc] = useState(false)
    const {sender, image, location, description, type, time} = props.post
    const [isSaved, setIsSaved] = useState(false)

    const id = useSelector(state => state.auth.id)

    const dispatch = useDispatch()

    const timeDiff = () => {
        let diff = Math.floor((Date.now() - time)/1000)
        if (diff > 60*60*24){
            return `${Math.floor(diff/=60*60*24)} day${diff>1? '' :'s'} ago`
        }else if(diff > 60*60){   
            return `${Math.floor(diff/=60*60)} hour${diff>1? '' :'s'} ago`
        }else if(diff > 60){  
            return `${Math.floor(diff/=60)} minute${diff>1? '' :'s'} ago`
        }else{
            return `${diff} seconds ago`
        }
    }

    const makeCall = () => {
        call({
            number: sender.phone,
            prompt: false
        })
    }

    const onSave = async () => {
        if(!id){
            Alert.alert(
                'Login required', 
                'You should be logged in to add contact !!',
                [{text: 'Go to login', onPress: () => props.nav.navigate('Settings') }, { text: 'Cancel', style: 'cancel'}] 
            )
            return
        }
        if(!isSaved){
            try {
                await dispatch(addContact(id, sender))
                setIsSaved( isSaved => !isSaved)
            } catch (error) {
            }
        }else{
            try {
                await dispatch(deleteContact(id, sender.id))
                setIsSaved( isSaved => !isSaved)
            } catch (error) {
            }
        }
    }
    return (
        <View style={style.postContainer}>
            <View style={style.header}>
                <View style={style.sender}>
                    {sender.dp 
                    ? <Image style={{height: 50, width:50 }} source={{uri: sender.dp}}/>
                    : <Image style={{height: 50, width:50 }} source={require('../assets/user.png')}/>}
                    <View>
                        <Text style={style.name}>{sender.name}</Text>
                        <Text style={style.location}>{location}</Text>
                    </View>
                </View>
                
                <TouchableOpacity onPress={makeCall}>
                    <View style={style.contact}>
                        <Feather name='phone-call' color='green' size={25} /> 
                    </View>
                </TouchableOpacity> 
                {/* <TouchableNativeFeedback onPress={() => props.nav.navigate('Chat', {sender: sender})}>
                    <View style={style.contact}>
                        <Text style={{color: 'white'}}>Message</Text>
                    </View> 
                </TouchableNativeFeedback>  */}
            </View>
            <Image source={{uri:image.toString()}} style={style.image} />
            <TouchableOpacity style={style.description} onPress={() => setShowDesc(showDesc => !showDesc)}>
                {showDesc
                    ? <Text>{description}</Text> 
                    : description.length < 50
                        ? <Text>{description}</Text>
                        : <View>
                            <Text>{description.slice(0, 50)}</Text>
                            <Text style={{color:'blue'}}>read more..</Text>
                        </View>
                }
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{ paddingRight: 3, fontWeight: 'bold'}}>Type - </Text>
                    <Text>{type}</Text>
                </View>
                <TouchableOpacity onPress={onSave}>
                    { id && id !== sender.id
                    ? isSaved 
                        ? <Feather name="user-x" size={25} color="red"/>
                        : <Feather name="user-plus" size={25} color="blue"/>
                    : null
                    }
                </TouchableOpacity>
            </View>
            <Text style={{paddingHorizontal: 10, paddingVertical: 5}}>{timeDiff()}</Text>
        </View>
    )
}

const {height, width} = Dimensions.get("window")
const style= StyleSheet.create({
    postContainer: {
        // alignItems: "center", 
        justifyContent: "center",
        marginVertical: 10,
        paddingVertical: 10,
        elevation: 2,
        borderRadius: 1,
    },
    image: {
        height: width, 
        width: width,
        flex: 1, 
        resizeMode: 'contain',
        // marginVertical: 10
    },
    sender:{
        flexDirection: "row"
    },
    name: {
        fontSize: 17,
        paddingHorizontal: 10,
        textTransform: 'capitalize'
    },
    contact: {
        marginHorizontal: 10,
        height: 30,
        // width: 80,
        justifyContent: "center",
        alignItems: 'center',
    },
    location: {
        paddingHorizontal: 10,
        fontStyle: 'italic'
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 5,
        flexDirection: 'row'
    },
    description: {
        paddingHorizontal: 10,
        paddingVertical: 5
    }
})

export default Post