"""Simple implementation of the Brainflip language."""

import argparse
import collections

def interpret(lines: [str]):
    memory = collections.defaultdict(int)
    index = 0

    loop_starts_stack = []
    start_to_end = {}
    end_to_start = {}
    processed_line = []

    for num, line in enumerate(lines):
        line = line.split('#')[0]  # Remove comments.
        line = line.strip()  # Remove whitespace.
        processed_line.append(line)

        if not line:
            continue
        if line == "loop":
            loop_starts_stack.append(num)
        elif line == 'end':
            if not loop_starts_stack:
                print(f"loop end on line {num + 1} was not started")
            else:
                start = loop_starts_stack.pop()
                start_to_end[start] = num
                end_to_start[num] = start
        elif line not in ["plus", "minus", "print", "left", "right", "read", "dump"]:
            print(f"unexpected command '{line}' on line {num + 1}")
            return

    if loop_starts_stack:
        print(f"loop started on line {loop_starts_stack[-1]} was never ended")
        return

    num = 0
    while num < len(lines):
        line = processed_line[num]
        if not line:
            num += 1
        elif line == "plus":
            memory[index] += 1
            num += 1
        elif line == "minus":
            memory[index] -= 1
            num += 1
        elif line == "left":
            index -= 1
            num += 1
        elif line == "right":
            index += 1
            num += 1
        elif line == "print":
            print(memory[index])
            num += 1
        elif line == "read":
            memory[index] = int(input("Enter a number: "))
            num += 1
        elif line == "dump":
            print(f"At line {num} [{index}]: {memory}")
            num += 1
        elif line == 'loop':
            if memory[index] == 0:
                num = start_to_end[num] + 1
            else:
                num += 1
        elif line == 'end':
            num = end_to_start[num]
        else:
            raise NotImplementedError(f'{line} not implemented')

def main():
    parser = argparse.ArgumentParser(description='A simple interpreter for brainfart.')
    parser.add_argument('file', nargs=1)
    args = parser.parse_args()
    interpret(list(open(args.file[0])))

if __name__ == '__main__':
    main()
