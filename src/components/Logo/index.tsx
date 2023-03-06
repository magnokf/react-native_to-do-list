import {Image, Text, View} from "react-native";
import {styles} from "./styles";

export default function Logo() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logo.png')}
                style={styles.image}
                resizeMode={'stretch'}
            />
            <Text style={styles.text}>
                My
                <Text style={styles.textBold}>Tasks</Text>
            </Text>
        </View>
    );
}