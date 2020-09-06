Brainflip is a programming language designed to teach kids.

Brainflip is different from other languages typically used for teaching
in that it has a very small set of commands (only 9) and allow learners to
focus on constructing algorithms without learning a large amount of syntax
or standard library. As a consequence, Brainflip makes it **much** harder to construct complex algorithms than other programming languages.

Brainflip has nearly identical symmatics to [Brainf!@k](https://en.wikipedia.org/wiki/Brainfuck) but with some changes to make it easier to learn.

The key idea behind Brainflip is that memory is an infinite list of integers
(initially set to zero) and there is a single pointer that records what integer
is the current one:

```
... 0 0 0 0 0 0 0 0 0 0 0 0 ...
              ↑
        current pointer
```

The commands are:

*  left: Move the memory pointer one integer to the left.
*  right: Move the memory pointer one integer to the right.
*  plus: Add one to the current integer.
*  minus: Subtract one from the current integer.
*  read: Read an integer from the user and replace the current one.
*  print: Print the current integer.
*  loop/end: While the current integer is not zero, execute the body of
   the loop.
*  #: A comment. Everything after this character on the same line is ignored.

Every command must be on it's own line, except for comments, which can be
written after another command.

Here is a simple example:
```
# Count down from the number that the user entered.
# For example:
# Enter a number: 5
# 5
# 4
# 3
# 2
# 1
read
loop
    print
    minus
end
```

