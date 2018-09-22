import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

import Weather from './src/components/Weather';

export default class App extends Component {

	state = {
		location: {}, 
		consolidated_weather: [], 
		scale: 'celsius', 
		coords: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0022,
			longitudeDelta: 0.0022
		} 
	};

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(this.currentPositionSuccess.bind(this), this.currentPositionFailure.bind(this));
	}
	
	currentPositionSuccess(position) {
		const { coords } = position;
		
		if (coords && coords.latitude && coords.longitude) {
			coords.latitudeDelta = 0.0022;
			coords.longitudeDelta = 0.0022;

			this.setState({ coords });
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
			<View style={{ flex: 1 }}>
				<Text>
					{this.renderLocationName()}
				</Text>
				{this.renderCurrentWeather()}
				<View style={{ flex: 1 }}>
					<MapView
						region={this.state.coords}
						style={{ ...StyleSheet.absoluteFillObject }}
					>
						<Marker
							coordinate={this.state.coords}
							image={require('./src/images/pin.png')}
							style={{ width: 5, height: 5 }}
						/>
					</MapView>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({

});
