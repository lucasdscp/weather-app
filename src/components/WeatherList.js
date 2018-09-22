import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';

import Weather from './Weather';

class WeatherList extends Component {
    formatDate(date) {
        return date < 10 ? `0${date}` : date;
    }

    renderWeatherList() {
        const { weather, isFahrenheit } = this.props;

        if (weather && weather.length) {
            console.log(weather);
            return weather.map((item, key) => {
                const date = new Date(item.applicable_date.replace(/-/g, '/'));
                const month = date.getMonth() + 1;

                const borderBottomColor = (key + 1) < weather.length ? '#ededed' : 'transparent';
                const paddingBottom = marginBottom = (key + 1) < weather.length ? 4 : 0;

                return (
                    <View style={[styles.body, { borderBottomColor, paddingBottom, marginBottom }]} key={key}>
                        <Text style={styles.dateText}>
                            {this.formatDate(date.getDate())}/{this.formatDate(month)}
                        </Text>
                        <Weather style={styles.weather} temp={item.the_temp} isFahrenheit={isFahrenheit} />
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
            <ScrollView>
                <View style={styles.list}>
                    {this.renderWeatherList()}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1
    },
    list: {
        borderColor: '#d5d5d5',
        borderWidth: 2,
        padding: 8,
    },
    icon: {
        width: 26,
        height: 26
    },
    dateText: {
        fontSize: 18,
        color: '#436389'
    },
    weather: {
        fontSize: 18,
        color: '#436389'
    }
});

export default WeatherList;