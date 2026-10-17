export class Logger {
    private  taskLogElement: HTMLElement;
    private devLogElement: HTMLElement; //rename
    constructor() {
        const tle = document.getElementById('taskLog');
        const dle = document.getElementById('devLog');
        if (!tle || !dle) throw new Error('log not found');

        this.taskLogElement = tle;
        this.devLogElement = dle;
    }
    public logTask(message: string) {
        console.log('TASK ' + message);
        this.taskLogElement.innerHTML += message + '<br>'
    }
    public logDev(message: string) {
        console.log('DEV ' + message);
        this.devLogElement.innerHTML += message + '<br>'
    }
}
