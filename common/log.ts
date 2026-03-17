import { test } from '@playwright/test';

export class Log {
    private stepNumber = 1;
    private readonly buffer: string[] = [];

    constructor(private readonly testTitle: string) { }

    step(description: string) {
        const line = `Step # ${(this.stepNumber <= 9 ? ` ${this.stepNumber}` : this.stepNumber)}: ${description}`;
        this.buffer.push(line);
        this.stepNumber++;
        test.info().annotations.push({ type: 'step', description: line });
    }

    // Print all buffered lines for a given test.
    postOutput(status: string) {
        if (!this.buffer.length) return;
        const header = `==== START: ${this.testTitle} [${status.toUpperCase()}] ====\n`;
        const footer = `\n==== END:   ${this.testTitle} [${status.toUpperCase()}] ====`;
        const body = this.buffer.join('\n');
        const content = header + body + footer;
        console.log(`\r\n${content}`);
        test.info().attach('Test Steps', { body: content, contentType: 'text/plain' });
    }
}