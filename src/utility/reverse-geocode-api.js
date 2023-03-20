import fetch from "node-fetch";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
	const config = dotenv.config({ path: "./config/config.env" });
} else {
	const config = dotenv.config({ path: "production.env" });
}

export async function GoogleGetLocationToAddress(lat, lon){
	const googleApiKey = process.env.Google_Geo_Api_key
	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;
	try {
		const response = await fetch(url)
		const json = await response.json()
		console.log(json)
		return response
	}
	catch(err) {
		console.log(err)
		return "Unable to connect to Api"
	}
}

export async function RapidGetLocationToAddress(lat, lon){
	const options = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": process.env.Rapid_Api_Key,
			"X-RapidAPI-Host": process.env.Rapid_Api_Host
		}
	};
	const url = `https://location-to-address.p.rapidapi.com/v1/geocode/reverse?lon=${lon}&lat=${lat}&limit=1&lang=en`;
	try {
		const response = await fetch(url, options)
		const json = await response.json()
		console.log(json)
		
		return await json.features
	}
	catch(err) {
		console.log(err)
		return "Unable to connect to Api"
	}
}
