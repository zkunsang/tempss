class RunTimeError extends Error {
    constructor(errorType, {message, name, code}) {
        super(message);
        this.errorType = errorType;
        this.name = name;
        this.code = code;
        this.errorIndex = null;
        this.errorDate = null;

        this.isHandled = false;
        this.additionalMessage = null;
    }

    toString() {
        const message = [];
        if(this.errorIndex) message.push(`ErrIndex: ${this.errorIndex}`);
        if(this.errorDate) message.push(`ErrDate: ${this.errorDate}`);
        if(this.errorType) message.push(`ErrType: ${this.errorType}`);
        if(this.message) message.push(`Msg: ${this.message}`);
        if(this.additionalMessage) message.push(`AddMsg: ${this.additionalMessage}`);
        if(this.stack) message.push(`Stack: ${this.stack}`);

        return message.join('\n');
    }

    setLogIndex(errorIndex) { this.errorIndex = errorIndex; }
    setLogDate(errorDate) { this.errorDate = errorDate; }

    setHandled() { this.isHandled = true; }
    getHandled() { return this.isHandled; }
}

module.exports = RunTimeError;