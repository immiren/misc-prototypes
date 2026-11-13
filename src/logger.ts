class Logger {
    private taskLogElement: HTMLElement;
    private devLogElement: HTMLElement; //rename
    private devLogCount = 0;
    private taskLogCount = 0;
    constructor() {
        const tle = document.getElementById('taskLog');
        const dle = document.getElementById('devLog');
        if (!tle || !dle) throw new Error('log not found');

        this.taskLogElement = tle;
        this.devLogElement = dle;
    }
    public logTask(message: string) {
        console.log('TASK ' + this.taskLogCount + ' ' + message);
        this.taskLogElement.innerHTML += this.taskLogCount + ' ' + message + '<br>'
        this.taskLogCount++;
    }
    public logDev(message: string) {
        console.log('DEV ' + this.devLogCount + ' ' + message);
        this.devLogElement.innerHTML += this.devLogCount + ' ' + message + '<br>'
        this.devLogCount++;
    }
}

export const LOGGER = new Logger();
