import React, { useState, useEffect } from 'react';
import { FlatList, View, ActivityIndicator, Text, Alert, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts, deleteContact } from '../store/actions/auth';

import { Feather } from '@expo/vector-icons';

import call from 'react-native-phone-call';

export default function contacts(props) {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    const user = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const onRefresh = () => {
        setIsRefreshing(true)
        fetchContacts()
    }
    
    const fetchContacts = async (id) => {
        try{
            setError(null)
            await dispatch(getContacts(id));
            setIsLoading(false)
            setIsRefreshing(false)
        }catch(err){
            setError(err.message)
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }
    
    useEffect(() => {
        setIsLoading(true)
        fetchContacts(user.id);
    }, [])

    if(!isLoading && error){
        Alert.alert(
            'Error', 
            'Something went wrong !!', 
            [{title: 'okay'}]);
        
        return (
            <View>
                <Button title='Reload' 
                onPress={()=> {
                    setIsLoading(true);
                    fetchPosts()
                }} />
            </View>
        )
    }

    const makeCall = () => {
        call({
            number: user.phone,
            prompt: false
        })
    }

    const onDelete = async (id) => {
        if(!id){
            return
        }
        
        try {
            await dispatch(deleteContact(user.id, id))
        } catch (error) {
            Alert.alert(
                'Error', 
                error.message, 
                [{title: 'okay'}]);
        }
    }

    if(isLoading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const EmptyComponent = () => {
        return(
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Text style={{color: 'grey'}}>Added contacts will be displayed here...</Text>
            </View>
        )
    }

    return (
        <FlatList
            ListEmptyComponent={EmptyComponent}
            style={styles.container}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            data={user.contacts}
            keyExtractor={(item, index) => item.id }
            renderItem={itemData =>
                <View>
                    {itemData.item
                        ? <TouchableOpacity onPress={() => {}}>
                            <View style={styles.option}>   
                                <Text style={styles.optionItem}>{itemData.item.name}</Text>
                                <View style={{flexDirection: 'row', }}>
                                    <TouchableOpacity style={{marginHorizontal: 10}} 
                                        onPress={makeCall}>
                                        <Feather name='phone-call' size={20} color='green' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginHorizontal: 10}} 
                                        onPress={() => onDelete(itemData.item.id)}>
                                        <Feather name='trash-2' size={20} color='red' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    : null }
                </View>
            } />
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      paddingVertical: 10,
    },
    box: {
        width: '100%',
        // marginBottom: 10,
        paddingVertical: 10,
        // borderBottomWidth: 1,
        alignItems: 'center'
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
        paddingLeft: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    optionItem: {
        fontSize: 15, 
        fontWeight: 'bold',
    }
  });