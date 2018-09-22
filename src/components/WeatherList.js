import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import Weather from './Weather';

class WeatherList extends Component {
    formatDate(date) {
        return date < 10 ? `0${date}` : date;
    }

    renderWeatherList() {
        const { weather, scale } = this.props;

        if (weather && weather.length) {
            console.log(weather);
            return weather.map((item, key) => {
                const date = new Date(item.applicable_date.replace(/-/g, '/'));
                const month = date.getMonth() + 1;

                return (
                    <View style={styles.body} key={key}>
                        <Text>
                            {this.formatDate(date.getDate())}/{this.formatDate(month)}
                        </Text>
                        <Weather temp={item.the_temp} scale={scale} />
                        <Image 
                        source={{uri: `https://www.metaweather.com/static/img/weather/png/${item.weather_state_abbr}.png` }} 
                        style={styles.icon}
                        />
                    </View>
                );
            });
        }
    }

    render() {
        return (
            <View>
                {this.renderWeatherList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        width: 30,
        height: 30
    }
});

export default WeatherList;