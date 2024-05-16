import axios from 'axios';

const instance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_URL
});

const token = localStorage.getItem('tokens');
if(token != null){
	instance.defaults.headers.common["Authorization"] = JSON.parse(token).Authorization;
}

export { instance }