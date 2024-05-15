import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL
});

const token = localStorage.getItem('tokens');
if(token != null){
	instance.defaults.headers.common["Authorization"] = JSON.parse(token).Authorization;
}

export { instance }