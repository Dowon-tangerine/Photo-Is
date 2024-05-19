export const dateFormatter = {
	changeDateFormat: (inputDateTimeString: string) => {
			// 입력 문자열을 Date 객체로 변환
			let date = new Date(inputDateTimeString);

			// 년, 월, 일, 시, 분, 초를 각각 추출하여 두 자리로 맞춤
			let year = date.getFullYear();
			let month = String(date.getMonth() + 1).padStart(2, '0');
			let day = String(date.getDate()).padStart(2, '0');
			// let hour = String(date.getHours()).padStart(2, '0');
			// let minute = String(date.getMinutes()).padStart(2, '0');
			// let second = String(date.getSeconds()).padStart(2, '0');

			// 원하는 형식으로 변환
			let formattedDateTimeString = `${year}-${month}-${day}`;

			// 결과 반환
			return formattedDateTimeString;
	},
	
	changeDateFormatToLocalDate: (date: Date | null) => {
		if (!date) return null;
		const pad = (num: number) => num.toString().padStart(2, '0');
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1); // months are zero-indexed
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
	}
};