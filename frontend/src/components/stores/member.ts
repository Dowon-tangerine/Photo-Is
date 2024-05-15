import { create } from 'zustand';

interface LoginStatus{
	isLogin: boolean;
	updateLoginStatus: (isLogin: boolean) => void;
}

const useLoginStatus = create<LoginStatus>(set => ({
	isLogin: false,
	updateLoginStatus: () => {
		set((state)=> ({isLogin: !state.isLogin}))
	}
}));

export default useLoginStatus