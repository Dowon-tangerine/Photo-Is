import { Component } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import styles from "./css/Calendar.module.css"
import "react-datepicker/dist/react-datepicker.css";

// 한국어 로케일 등록
registerLocale("ko", ko);

interface State {
    startDate: Date | null;
    endDate: Date | null;
}

export default class UserInfo extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
        };
    }

    setChangeDate = (dates: [Date, Date] | null) => {
        if (dates) {
            const [start, end] = dates;
            this.setState({ startDate: start, endDate: end });
        } else {
            this.setState({ startDate: null, endDate: null });
        }
    };

    render() {
        return (
            <div className={styles.datepicker}>
                <DatePicker
                    selectsRange
                    locale="ko"
                    className={styles.datepicker_input}
                    dateFormat="yyyy년 MM월 dd일"
                    selected={this.state.startDate}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    maxDate={new Date()}
                    onChange={(dates: [Date, Date]) => this.setChangeDate(dates)}></DatePicker>
                <img src="/imgs/calendar_icon.png" style={{height : '30px', width : 'auto', cursor : 'pointer', position : 'absolute', right : '10px'}}></img>
            </div>
        );
    }
}
