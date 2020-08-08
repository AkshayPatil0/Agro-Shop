import React, { useState, useEffect } from 'react';
import { FlatList, View, ActivityIndicator, Text, Alert, Button, Image, StyleSheet, Linking } from 'react-native';
import Post from './Post';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../store/actions/posts';
import { TouchableNativeFeedback} from 'react-native-gesture-handler';

export default function Posts(props) {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const posts = useSelector(state => state.posts.posts)
    const dispatch = useDispatch()

    const onRefresh = () => {
        setIsRefreshing(true)
        fetchPosts()
    }
    
    const fetchPosts = async () => {
        try{
            setError(null)
            await dispatch(getPosts());
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
        fetchPosts();
        return function(){
            setIsLoading(false)
        }
    }, [])

    if(!isLoading && error){
        Alert.alert(
            'Something went wrong !', 
            error, 
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

    if(isLoading){
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const header = 
    <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <View style={style.iconContainer}>
            <View style={style.icon}>
            <TouchableNativeFeedback style={{justifyContent: 'space-between', alignItems: 'center'}} onPress={() => Linking.openURL('https://www.accuweather.com/')}>
                <Image source={require('../assets/weather.png')} style={style.iconImg} />
                <Text style={{paddingBottom: 5}}>Check weather</Text>
            </TouchableNativeFeedback>
            </View>
            <View style={style.icon}>
            <TouchableNativeFeedback style={{justifyContent: 'space-between', alignItems: 'center'}} onPress={() => Linking.openURL('http://epaper.agrowon.com/flashclient/client_panel.aspx#currPage=1')}>
                <Image source={require('../assets/news.png')} style={style.iconImg} />
                <Text style={{paddingBottom: 5}}>Check News</Text>
            </TouchableNativeFeedback>
            </View>
        </View>
    </View>

    return (
            <FlatList 
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                data={posts}
                keyExtractor={(item, index) => item.id}
                renderItem={itemData =>
                    <Post post={itemData.item} nav={props.nav} />
                } 
                ListHeaderComponent={header}
                />
    )
}

const style = StyleSheet.create({
    iconContainer:{
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    icon: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 15,
        // elevation: 2,
        overflow: 'hidden',
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    iconImg: {
        height: 100, 
        width: 100,
        borderRadius: 50
    }
})