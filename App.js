import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import Weather from './src/components/Weather';

export default class App extends Component {

	state = { location: {}, consolidated_weather: [], scale: 'celsius' };

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(this.currentPositionSuccess.bind(this), this.currentPositionFailure.bind(this));
	}
	
	currentPositionSuccess(position) {
		const { coords } = position;
		
		if (coords && coords.latitude && coords.longitude) {
			this.getWorldID(coords.latitude, coords.longitude);
		}
	}

	currentPositionFailure(err) {
		console.log(err);
	}

	getWorldID(lat, lon) {
		axios.get(`https://www.metaweather.com/api/location/search/?lattlong=${lat},${lon}`)
		.then((res) => {
			if (res && res.data) {
				const { data } = res;
				
				if (data && data.length) {
					this.setState({ location: data[0] });
					this.getWeather();
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
	}

	getWeather() {
		const { location } = this.state;

		if (location && location.woeid) {
			axios.get(`https://www.metaweather.com/api/location/${location.woeid}/`)
			.then((res) => {
				if (res && res.data) {
					const { data } = res;
					
					if (data && data.consolidated_weather && data.consolidated_weather.length) {
						const { consolidated_weather } = data;
						this.setState({ consolidated_weather });
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});
		}		
	}

	renderLocationName() {
		const { location } = this.state;
		return location && location.title ? location.title : 'Carregando...';
	}

	renderCurrentWeather() {
		const { consolidated_weather, scale } = this.state;

		if (consolidated_weather && consolidated_weather.length) {
			return (
				<Weather temp={consolidated_weather[0].the_temp} scale={scale} />
			);
		}
	}

	render() {
		return (
			<View>
				<Text>
					{this.renderLocationName()}
				</Text>
				{this.renderCurrentWeather()}
			</View>
		);
	}
}

const styles = StyleSheet.create({

});
