const showPhotoDetail = (x, z) => {
	let value = -1;
	if(z > 6) { // 9.95
		if(x > 0){
			// "빅사이즈 (가장 왼쪽)"
			value = 0;
		}
		else if(x < -3 && x > -8) {
			// "빅사이즈 (가운데)"
			value = 1;
		}
		else if(x < -11){
			// "빅사이즈 (가장 오른쪽)"
			value = 2;
		}
		else {
			value = -1;
		}
	}
	else if(z < 5 && z > 2) {
		if(x < 1 && x > -1){
			// "왼쪽 미니사이즈 1"
			value = 3;
		}
		else if(x < -9 && x > -12){
			// "오른쪽 미니사이즈 1"
			value = 4;
		}
		else {
			value = -1;
		}
	}
	else if(z < 0 && z > -3){
		if(x < 1 && x > -1){
			// "왼쪽 미니사이즈 2"
			value = 5;
		}
		else if(x < -9 && x > -12){
			// "오른쪽 미니사이즈 2"
			value = 6;
		}
		else {
			value = -1;
		}
	}
	else if(z < -5 && z > -8){
		if(x < 1 && x > -1){
			// "왼쪽 미니사이즈 3"
			value = 7;
		}
		else if(x < -9 && x > -12){
			// "오른쪽 미니사이즈 3"
			value = 8;
		}
		else {
			value = -1;
		}
	}
	else{
		value = -1;
	}
	return value;
}

export default showPhotoDetail;