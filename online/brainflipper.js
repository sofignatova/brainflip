class Brainflipper {

    constructor(lines) {
        this.commands = [];
        this.startToEnd = {}
        this.endToStart = {}

        var lineNumber = 1
        var commandNumber = 0
        var loopStarts = []
        lines.forEach(line => {
            var command = line.split("#")[0].trim()
            if (command) {
                if (command == "loop") {
                    loopStarts.push(commandNumber);
                } else if (command == "end") {
                    if (loopStarts.length == 0) {
                        throw new Error("loop end on line " + lineNumber + " was never started");
                    }
                    var start = loopStarts.pop();
                    this.startToEnd[start] = commandNumber;
                    this.endToStart[commandNumber] = start;
                } else if (["plus", "minus", "left", "right", "loop", "end", "print", "read"].indexOf(command) == -1) {
                    throw new Error('unexpected command "' + command + '" on line ' + lineNumber);
                }
                ++commandNumber;
                this.commands.push({ 'command': command, 'line': lineNumber });
            }
            ++lineNumber;
        });
    }

    run() {
        var commandNumber = 0
        var memory = {}
        var index = 0

        while (commandNumber < this.commands.length) {
            var command = this.commands[commandNumber]

            switch (command.command) {
                case "print":
                    this.write(memory[index] || 0);
                    ++commandNumber;
                    break;
                case "minus":
                    memory[index] = (memory[index] || 0) - 1;
                    ++commandNumber;
                    break;
                case "plus":
                    memory[index] = (memory[index] || 0) + 1;
                    ++commandNumber;
                    break;
                case "left":
                    --index;
                    ++commandNumber;
                    break;
                case "right":
                    ++index;
                    ++commandNumber;
                    break;
                case "loop":
                    if (memory[index]) {
                        ++commandNumber
                    } else {
                        commandNumber = this.startToEnd[commandNumber] + 1;
                    }
                    break;
                case "end":
                    commandNumber = this.endToStart[commandNumber];
                    break;
                default:
                    throw new Error('Unexpected command "' + command.command + '" on line ' + command.line)
            }
        }
    }

    write(x) {
        var output = document.getElementById("output")
        output.textContent += x + "\n"
    }
}