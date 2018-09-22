import React, { Component }  from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

import Weather from './src/components/Weather';
import WeatherList from './src/components/WeatherList';

export default class App extends Component {

	state = {
		location: {}, 
		consolidated_weather: [],
		isFahrenheit: false,
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

	toggleSwitch() {
		this.setState({ isFahrenheit: !this.state.isFahrenheit });
	}

	renderLocationName() {
		const { location } = this.state;
		return location && location.title ? location.title : 'Carregando...';
	}

	renderCurrentWeather() {
		const { consolidated_weather, isFahrenheit } = this.state;

		if (consolidated_weather && consolidated_weather.length) {
			return (
				<Weather style={styles.locationTemp} temp={consolidated_weather[0].the_temp} isFahrenheit={isFahrenheit} />
			);
		}
	}

	render() {
		const { consolidated_weather, isFahrenheit } = this.state;

		return (
			<View style={styles.body}>
				<View style={styles.locationContainer}>
					<Text style={styles.locationName}>
						{this.renderLocationName()}
					</Text>
					{this.renderCurrentWeather()}
				</View>
				<View style={styles.mapContainer}>
					<MapView
						region={this.state.coords}
						style={styles.map}
					>
						<Marker
							coordinate={this.state.coords}
							image={require('./src/images/pin.png')}
						/>
					</MapView>
				</View>
				<View style={styles.weatherContainer}>
					<WeatherList weather={consolidated_weather} isFahrenheit={isFahrenheit} />
				</View>
				<View style={styles.switchContainer}>
					<Text style={styles.scaleText}>
						Celsius / Fahrenheit
					</Text>
					<Switch
						onValueChange={this.toggleSwitch.bind(this)}
						value={isFahrenheit}
						trackColor={{ true: "#ffae82", false: null }}
						_thumbColor="#ff5a00"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: { 
		flex: 1, 
		padding: 16,
		backgroundColor: '#FFF'
	},
	locationName: {
		fontSize: 26,
		textAlign: 'center'
	},
	locationTemp: {
		fontSize: 22,
		textAlign: 'center'
	},
	locationContainer: {
		minHeight: 80
	},
	mapContainer: {
		flex: 0.8,
		borderRadius: 5,
		overflow: 'hidden',
		backgroundColor: '#FFF'
	},
	map: { 
		...StyleSheet.absoluteFillObject 
	},
	weatherContainer: {
		flex: 1,
		marginTop: 16
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	scaleText: {
		marginRight: 8,
		fontSize: 16
	}
});
