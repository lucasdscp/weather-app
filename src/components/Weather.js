import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Weather extends Component {
    state = { temp: this.props.temp };

    renderTemp() {
        const { scale } = this.props;
        let temp = this.state.temp;

        if (temp) {
            if (scale === 'fahrenheit') temp = (temp * 1.8) + 32;
            return `${parseInt(temp)}°`;
        } else {
            return '...';
        }
    }

    render() {
        return (
            <View>
                <Text>
                    {this.renderTemp()}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export default Weather;