export class KeyController {
    keys: { [key: string]: boolean }; // 키의 상태를 저장하는 객체
    websiteMode: boolean; // 웹사이트 모드 플래그

    constructor() {
        this.keys = {};
        this.websiteMode = false;

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!this.websiteMode) {
                this.keys[event.code] = true;
                console.log(event.code);
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (!this.websiteMode) {
                delete this.keys[event.code];
            }
        });
    }

    setWebsiteMode(mode: boolean): void {
        this.websiteMode = mode;
    }
}
