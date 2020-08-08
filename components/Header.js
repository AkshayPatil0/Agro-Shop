import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function Header() {
    return (
        <View style={style.header}>
            <Text style={style.brand}>Farming</Text>
        </View>
    )
}

const style = StyleSheet.create({
    header: {
        marginTop: 20,
        padding: 20,
        width: "110%",
        height: '10%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        // backgroundColor: '#A9FF98',
        elevation: 3
    },
    brand: {
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        paddingLeft: 20
    }
})