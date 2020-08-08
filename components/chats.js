import React, { useState, useEffect } from 'react';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import Post from './Post';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../store/actions/posts';

Posts = props => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const posts = useSelector(state => state.posts.posts)
    const dispatch = useDispatch()

    const fetchPosts = async () => {
        try{
            setError(null)
            setIsRefreshing(true)
            await dispatch(getPosts());
            setIsRefreshing(false)
        }catch(err){
            setIsRefreshing(false)
            setError(err.message)
        }
    }
    
    useEffect(() => {
        setIsLoading(true)
        fetchPosts();
        setIsLoading(false)
    }, [dispatch])

    if(!isLoading && error){
        return(
            <View>
                <Text>{error}</Text>
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
    return (
        <FlatList 
            onRefresh={fetchPosts}
            refreshing={isRefreshing}
            data={posts}
            keyExtractor={(item, index) => item.id}
            renderItem={itemData =>
                <Post post={itemData.item} nav={props.nav} />
        } />
    )
}

export default Posts