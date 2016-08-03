# Command Line Interface

[![Build Status](https://travis-ci.org/mkdoc/mkcli.svg?v=3)](https://travis-ci.org/mkdoc/mkcli)
[![npm version](http://img.shields.io/npm/v/mkcli.svg?v=3)](https://npmjs.org/package/mkcli)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkcli/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkcli?branch=master)

> Define command line interfaces as markdown

Describe a command line interface as an easy to read man-style markdown document and compile it to a program descriptor; the JSON program descriptor can then be used by the program implementation to parse and validate arguments.

The markdown program definitions can be converted to man pages, help files and shell completion scripts.

Encourages a document first approach to writing command line interfaces in a fluid natural language writing style.

## Install

```
npm i mkcli --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Example](#example)
- [Guide](#guide)
  - [Defining Programs](#defining-programs)
    - [Name](#name)
    - [Synopsis](#synopsis)
    - [Description](#description)
    - [Arguments](#arguments)
      - [Flags](#flags)
      - [Options](#options)
        - [Required](#required)
        - [Multiple](#multiple)
        - [Type Info](#type-info)
        - [Default Value](#default-value)
    - [Commands](#commands)
    - [Identifiers](#identifiers)
    - [Manual Sections](#manual-sections)
  - [Synopsis Expansion](#synopsis-expansion)
    - [Flags](#flags-1)
    - [Options](#options-1)
    - [Exclusive Options](#exclusive-options)
    - [Expansion Example](#expansion-example)
  - [Compiling Programs](#compiling-programs)
  - [Creating Documentation](#creating-documentation)
    - [Help Styles](#help-styles)
    - [Help Sections](#help-sections)
  - [Completion](#completion)
    - [Actions](#actions)
    - [Synopsis Completion](#synopsis-completion)
    - [Specification Completion](#specification-completion)
    - [Command Completion](#command-completion)
- [Help](#help)
- [API](#api)
  - [src](#src)
  - [compiler](#compiler)
  - [dest](#dest)
    - [Options](#options-2)
  - [load](#load)
  - [run](#run)
- [License](#license)

---

## Example

To compile all output types to the same directory as the input file:

```shell
mkcli program.md
```

Compile all output types to a specific directory:

```shell
mkcli program.md -o build
```

Compile a specific output type:

```shell
mkcli -t man program.md
```

Compile a specific output type to a particular directory:

```shell
mkcli -t zsh program.md --zsh build/zsh
```

If you have a lot of programs pass a directory and all markdown documents in the directory are compiled:

```shell
mkcli doc/cli -o build
```

You may pipe input for more control over the output; to set a man page title:

```shell
mkcat program.md | mkcli -t man | mkman --title program > program.1
```

See [help](#help) for more options.

Example files for a simple working program are in [doc/example](https://github.com/mkdoc/mkcli/blob/master/doc/example):

* [program definition](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv.md)
* [program descriptor](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv.json)
* [help file](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv.txt)
* [man page](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv.1)
* [zsh completion](https://github.com/mkdoc/mkcli/blob/master/doc/example/_argv)
* [program implementation](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv.js)
* [minimal executable](https://github.com/mkdoc/mkcli/blob/master/doc/example/argv)

Every program in the [mkdoc][] toolkit is compiled using this library:

* [definitions](https://github.com/mkdoc/mkdoc/tree/master/doc/cli)
* [compiled descriptors](https://github.com/mkdoc/mkdoc/tree/master/doc/json)
* [help files](https://github.com/mkdoc/mkdoc/tree/master/doc/help)
* [man pages](https://github.com/mkdoc/mkdoc/tree/master/doc/man)
* [zsh completion](https://github.com/mkdoc/mkdoc/tree/master/doc/zsh)
* [program implementations](https://github.com/mkdoc/mkdoc/tree/master/cli)
* [executables](https://github.com/mkdoc/mkdoc/tree/master/bin)

## Guide

### Defining Programs

The markdown document defines sections that start with a level one heading and continue until the next level one heading or the end of file is reached.

The sections that have special meaning to the compiler are [NAME](#name), [SYNOPSIS](#synopsis), [DESCRIPTION](#description), [COMMANDS](#commands) and [OPTIONS](#arguments).

It is considered best practice to declare these sections in the order listed.

All other sections are deemed to be man page sections they are ignored from help output by default (but may be included at compile time) and are always included when generating man pages.

Section headings are not case-sensitive so you can use upper case, title case or lower case but they must match exactly.

#### Name

Like man pages the name section is required and it **must** include a brief summary of the program after the program name. Delimit the program name from the short summary using a hyphen surrounded by spaces as shown below.

The name section must be the first section in the file otherwise the compiler will error.

The program name and summary is extracted from the first paragraph under the *NAME* heading:

```markdown
# Name

prg - short program summary
```

For subcommands define parent names for a command using whitespace between the words:

```markdown
# Name

prg list - perform list action
```

Add a list when a program can have multiple names:

```markdown
# Name

prg - short program summary

+ prg-alias
```

#### Synopsis

The program synopsis is created from all code block elements under the *SYNOPSIS* heading:

```markdown
# Name

prg - short program summary

# Synopsis

    [options] [file...]
```

It is a compiler error if any other type is declared in the synopsis section.

#### Description

The program description is created from all block level elements under the *DESCRIPTION* heading:

```markdown
# Name

prg - short program summary

# Description

An extended description that can include paragraphs, lists, code blocks and other block level elements.
```

Note that the help output only includes paragraphs so some meaning may be lost if you include lists, code blocks or block quotes. For this reason it is recommended that the description section only contain paragraphs.

If you mix content in the description section you can use the `-d, --desc` option when generating the help file to restrict the number of paragraphs included in the help output.

Consider this example:

```markdown
# Name

prg - short program summary

# Description

Simple program.

Run with:

    cat file.md | prg
```

Context would be lost on the second paragraph because the code block would not be included in the help output, whilst it would make perfect sense in the man output.

To prevent this loss of context just include the first paragraph in the help output:

```shell
mkcat program.md | mkcli --desc 1 | mktext
```

#### Arguments

Program arguments are declared with a heading of *OPTIONS* and a list following the heading.

Note the list bullet character `+` is preferred because it creates a more idiomatic listing in generated man pages.

```markdown
# Name

prg - short program summary

# Options

+ `-i, --input [FILE...]` Input files
+ `-o, --output [FILE]` Output file
```

An argument is declared as a list item whose first child is an inline code element which defines a *specification*.

The specification is parsed into an object representing the argument which may be of type `flag`, `option` or `command`.

The remaining list item content after the specification is treated as a description for the argument.

##### Flags

An argument specification with no value is treated as a flag option:

```markdown
+ `-v, --verbose` Print more information
```

##### Options

To create an option argument specify a value in either `[]` or `<>`:

```markdown
+ `-o, --output [FILE]` Output file
```

###### Required

When the `<>` notation is used it indicates that that the option is required:

```markdown
+ `-t, --type <TYPE>` Output format
```

The parsed option will have the `required` flag set.

###### Multiple

To signify that an option argument is repeatable include an ellipsis:

```markdown
+ `-i, --input [FILE...]` Input files
```

The parsed option will have the `multiple` flag set.

###### Type Info

You can associate some type information with the `{}` notation:

```markdown
+ `-i, --indent [NUM] {Number}` Amount of indentation
```

The parsed option will have the `kind` property set to `Number`.

You can delimit multiple types with `|` and `kind` is expanded to an array. This is useful to indicate an argument may be of multiple types or if you want to treat an argument value as an enum:

```markdown
+ `-t, --type [VAL] {json|help|man}` Renderer type
```

###### Default Value

To specify a default value for the option use the `=` operator in the type:

```markdown
+ `-i, --indent [NUM] {Number=2}` Amount of indentation
```

The parsed option will have the `kind` property set to `Number` and the  `value` property set to `2`.

You can just specify the default value using:

```markdown
+ `-i, --indent [NUM] {=2}` Amount of indentation
```

In which case the `kind` property will be `undefined` and the  `value` property is set to `2`.

#### Commands

Commands are declared in the same way as program arguments but under the *COMMANDS* heading:

```markdown
# Name

prg - short program summary

# Commands

+ `ls, list` List tasks
+ `i, info` Print task information
```

They allow you to create complex programs with options specific to a command.

Command files are loaded and compiled automatically following a naming convention. Using the above example to define the `list` command create a file named `prg-list.md`:

```markdown
# Name

list - list tasks

# Options

+ `-a, --all` List all tasks
+ `-t=[TYPE...]` List tasks of TYPE
```

Will result in the compiled tree containing options specific to the `list` command.

#### Identifiers

When a program is created from a source markdown document each argument and command is given a key for the resulting map. This key is generated automcatically by using the longest argument (or command) name and converting it to camel case.

If you wish to use a fixed key you can add an identifier followed by a colon (`:`) to the beginning of the specification:

```markdown
# Name

prg - short program summary

# Commands

+ `tasks: ls, list` List tasks

# Options

+ `verbose: -v` Print more information
```

#### Manual Sections

A heading that is not matched by any of the rules above is treated as a manual section:

```markdown
# Name

prg - short program summary

# Environment

The environment variable FOO changes the behaviour to `bar`.
```

The section ends when the next level one heading is encountered or the end of the file is reached.

### Synopsis Expansion

Unless disabled the synopsis declaration is expanded for the `man` and `help` output types.

#### Flags

Use the notation `[flags]` (or `<flags>`) in the synopsis and it will be replaced with all short form (single character) flag options (for example: `-xvf`).

#### Options

Use the notation `[options]` (or `<options>`) in the synopsis and it will be replaced with all option names that are not declared in the synopsis and were not expanded using the `[flags]` notation.

#### Exclusive Options

You should indicate mutually exclusive options using a vertical bar between option names.

When compiling to JSON the synopsis is parsed and any mutually exclusive declarations are added to the output using the target option keys.

It is a compiler error if the target option is not declared.

#### Expansion Example

Given a definition such as:

```markdown
# Name

prg - short program summary

# Synopsis

    [flags] [options] [--xml|--html] <file...>

# Options

+ `-X, --xml` Print as XML
+ `-H, --html` Print as HTML
+ `-V` Print more information
+ `-h, --help` Display help and exit
+ `--version` Print the version and exit
```

The synopsis is expanded to:

```
prg [-XHVh] [--help] [--version] [--xml|--html] <file...>
```

### Compiling Programs

To compile the markdown document to a JSON program descriptor run:

```shell
mkcli -t json program.md
```

Now you have a JSON document that describes your program commands and options.

### Creating Documentation

Once you have defined the program you will want to generate a man page and some help text.

To create the help text run:

```shell
mkcli -t help program.md
```

For a man page run:

```shell
mkcli -t man program.md
```

#### Help Styles

The default column help style (`col`) should suit most purposes however the other styles can be useful. The `list` style renders a list of the commands and options which is designed for when you have very long argument names or a few arguments that require long descriptions.

The `cmd` style is a list of command names (options are not printed) designed to be used when a program has lots of commands and a command is required. Typically the program would show this help page when no command was specified to indicate to the user a command is required.

Sometimes you may want very minimal help output that just includes the usage synopsis in which case use the `usage` style.

#### Help Sections

Sometimes when creating help files you may want to include a section from the manual, possibly you want to include an *Environment* section to show the environment variables your program recognises.

Pass regular expression patterns using the `--section` option and if they match a section heading the section will be included in the help after the commands and options.

To include an *Environment* section you could use:

```shell
mkcli -t help -S env program.md
```

To include the *Environment* and *Bugs* sections you could use:

```shell
mkcli -t help -S env -S bug program.md
```

Or if you prefer:

```shell
mkcli -t help -S '(env|bug)' program.md
```

See the [help](#help) for more options available when creating help and man pages.

### Completion

Completion scripts are currently available for zsh. To install a completion script for a program copy the script to a directory in `$fpath` or modify `~/.zshrc` to autoload the directory containing the completion script:

```zsh
fpath=(/path/to/completion $fpath)
```

A full working completion example is the [notes](https://github.com/mkdoc/mkcli/blob/master/test/fixtures/completion) test fixture.

Sometimes you may wish to reload a completion for testing purposes:

```zsh
unfunction _notes && autoload -U _notes
```

#### Actions

Some option value specifications map to zsh completion functions:

* user: `:user:_users`
* group: `:group:_groups`
* host: `:host:_hosts`
* domain: `:domain:_domains`
* file: `:file:_files`
* dir: `:directory:_directories`
* url: `:url:_urls`

Such that an option specification such as:

```markdown
+ `-i, --input [file...]` Input files
+ `-o, --output <dir>` Output directory
```

Will result in the `_files` completion function being called to complete file paths for the `--input` option and the `_directories` function for the `--output` option. Note that the ellipsis (...) multiple flag is respected so `--input` will be completed multiple times whilst `--output` will only complete once.

For options that specify a list of types the `_values` completion function is called.

```markdown
+ `-t, --type=[TYPE] {json|yaml}` Output type
```

Results in automatic completion for the `--type` option to one of `json` or `yaml`.

Actions are enclosed in double quotes (") so you may use single quotes and paired double quotes but not a single double quote which will generate an `unmatched "` zsh error.

#### Synopsis Completion

The program synopsis section is inspected and will use completion functions when a match is available, so a synopsis such as:

```markdown
[options] [files...]
```

Will result in the _files completion function called, see above for the list of matches and completion functions.

Sometimes you may need to create a custom completion list; you can set the info string of fenced code blocks in the synopsis section to inject scripts. The value may be either `zsh-locals` to inject code into the beginning of the body of the generated completion function and `zsh` to add to the list of completion actions.

A real-world example is [mk](https://github.com/mkdoc/mkdoc#mk) ([program definition](https://raw.githubusercontent.com/mkdoc/mkdoc/master/doc/cli/mk.md) and [compiled completion script](https://github.com/mkdoc/mkdoc/blob/master/doc/zsh/_mk)) which completes on the available task names.

#### Specification Completion

You may wish to change the zsh action taken per option, this can be done by appending a colon and the zsh action to an option specification:

```markdown
+ `-p, --package=[FILE] :file:_files -g '+.json'` Package descriptor
```

Which will complete files with a `.json` extension for the `--package` option.

#### Command Completion

Commands are recursively added to the completion script; they are completed using the following rules:

* Required commands (`<command>` in the synopsis) will not list options by default.
* Command options inherit from the global options.
* Command options cascade to child options.
* Rest pattern matches (`*: :file:_files` for example) are respected.

It is recommended you use a program synopsis with the command first:

```markdown
# Synopsis

    <command> [options] [files...] 
```

Or if the command is not required:

```markdown
# Synopsis

    [command] [options] [files...] 
```

Which is because command completion is terminated when an option is intermingled with the command hierarchy. Consider a program that has the command structure `notes > list > bug|todo|feature` if you present a command line such as:

```shell
notes list --private
```

Completion will no longer be attempted on the `list` sub-commands. To put it another way *commands must be consecutive* for command completion to occur.

## Help

```
Usage: mkcli [-frRCHFNPh] [--full] [--recursive] [--raw-synopsis] [--colon]
             [--header] [--footer] [--newline] [--preserve] [--help]
             [--version] [--package=<file>] [--type=<type>] [--style=<val>]
             [--cols=<num>] [--split=<num>] [--desc=<num>] [--indent=<num>]
             [--align=<type>] [--usage=<val>] [--section=<ptn...>]
             [--json=<dir>] [--text=<dir>] [--man=<dir>] [--zsh=<dir>]
             [--output=<dir>] [files...]

  Compiles markdown cli definitions.

Options
  -p, --package=[FILE]    Use package descriptor
  -t, --type=[TYPE]       Output renderer type (json|help|man)
  -y, --style=[VAL]       Help output style (col|list|cmd|usage)
  -c, --cols=[NUM]        Wrap help output at NUM (default: 80)
  -s, --split=[NUM]       Split help columns at NUM (default: 26)
  -d, --desc=[NUM]        Number of description paragraphs for help output
  -i, --indent=[NUM]      Number of spaces for help indentation (default: 2)
  -a, --align=[TYPE]      Alignment of first help column (left|right)
  -u, --usage=[VAL]       Set usage message for help synopsis (default: Usage:)
  -f, --full              Do not compact compiled descriptor
  -r, --recursive         Recursively load command definitions
  -R, --raw-synopsis      Do not expand synopsis
  -C, --colon             Append a colon to headings in help output
  -S, --section=[PTN...]  Include sections matching patterns in help output
  -H, --header            Include default header in help output
  -F, --footer            Include default footer in help output
  -N, --newline           Print leading newline when no header
  -P, --preserve          Do not upper case headings in man output
  -J, --json=[DIR]        Set output directory for json files
  -T, --text=[DIR]        Set output directory for help text files
  -M, --man=[DIR]         Set output directory for man pages
  -Z, --zsh=[DIR]         Set output directory for zsh completion
  -o, --output=[DIR]      Set output directory for all types
  -h, --help              Display help and exit
  --version               Print the version and exit

mkcli@1.0.31 https://github.com/mkdoc/mkcli
```

## API

### src

```javascript
src([opts])
```

Gets a source parser stream that transforms the incoming tree nodes into
parser state information.

Returns a parser stream.

* `opts` Object parser options.

### compiler

```javascript
compiler([opts])
```

Gets a compiler stream that transforms the parser state information to
a program definition.

Returns a compiler stream.

* `opts` Object compiler options.

### dest

```javascript
dest([opts])
```

Gets a destination renderer stream.

When no type is specified the JSON renderer is assumed.

Returns a renderer stream of the specified type.

* `opts` Object renderer options.

#### Options

* `type` String=json the renderer type.

### load

```javascript
load(def[, opts])
```

Load a program definition into a new program assigning the definition
properties to the program.

Properties are passed by reference so if you modify the definition the
program is also modified.

Returns a new program.

* `def` Object the program definition.
* `opts` Object program options.

### run

```javascript
run(src, argv[, runtime], cb)
```

Load a program definition into a new program assigning the definition
properties to the program.

Properties are passed by reference so if you modify the definition the
program is also modified.

The callback function signature is `function(err, req)` where `req` is a
request object that contains state information for program execution.

Plugins may decorate the request object with pertinent information that
does not affect the `target` object that receives the parsed arguments.

Returns a new program.

* `src` Object the source program or definition.
* `argv` Array the program arguments.
* `runtime` Object runtime configuration.
* `cb` Function callback function.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on April 19, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkast]: https://github.com/mkdoc/mkast
[through]: https://github.com/tmpfs/through3
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

