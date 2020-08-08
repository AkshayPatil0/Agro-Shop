import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window')

export const color={
    primary: 'blue',
    secondory: 'green',
    button1: 'blue',
    button2: 'green'
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: '100%',
        // width: '100%',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    title:{
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20
    },
    textInput: {
        width: width * 0.7,
        borderWidth: 1,
        borderRadius: width * 0.035,
        marginBottom: 20,
        paddingHorizontal: width * 0.035,
        paddingVertical: 5,
        fontSize: 15
    },
    buttonContainer:{
        // width: width * 0.4,
        // marginVertical: 20
    },
    button: {
        padding: width * 0.018,
        paddingHorizontal: 20,
        borderWidth: 1,
        // height: 30,
        // width: width * 0.6,
        borderRadius: width * 0.012,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: color.button2,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white'
    }
})
