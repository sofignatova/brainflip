'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

function format(document: vscode.TextDocument, defaultOptions: vscode.FormattingOptions): vscode.TextEdit[] {
	let indentation = 0
	let mods = []
    if (!defaultOptions) {
        defaultOptions = {
            insertSpaces: true,
            tabSize: 4,
        };
    }
	for (let i = 0; i < document.lineCount; ++i) {
		let r = document.lineAt(i).range
		let line = document.getText(r)
		let command = line.split("#")[0].trim()
		if (command == "end") {
			indentation -= 1;
		}
		if (defaultOptions.insertSpaces) {
			line = " ".repeat(indentation * defaultOptions.tabSize) + line.trim()
		} else {
			line = "\t".repeat(indentation) + line.trim()
		}
		if (line != document.getText(r)) {
			mods.push(vscode.TextEdit.replace(r, line))
		}
		if (command == "loop") {
			indentation += 1
		}
	}
	return mods;
}

export function activate(context: vscode.ExtensionContext) {

	const collection = vscode.languages.createDiagnosticCollection('test');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}

	const provideDocumentFormattingEdits = <vscode.DocumentFormattingEditProvider>{
		provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions) => format(document, options)
	};

	vscode.languages.registerDocumentFormattingEditProvider(
		'brainflip', provideDocumentFormattingEdits)


	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(editor => {
		if (editor) {
			updateDiagnostics(editor.textEditor.document, collection);
		}
	}));

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	}));
}

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	let text = document.getText()

	let messages = []
	let loop_stack = []
	for (let i = 0; i < document.lineCount; ++i) {
		let r = document.lineAt(i).range
		let line = document.getText(r)
		line = line.split("#")[0].trim()
		if (line.length == 0) {
			continue
		} else if (["left", "right", "plus", "minus", "read", "write", "loop", "end"].indexOf(line) == -1) {
			messages.push(
				{
					code: '',
					message: 'invalid command',
					range: r,
					severity: vscode.DiagnosticSeverity.Error,
					source: ''
				})
		} else if (line == "loop") {
			loop_stack.push(r)
		} else if (line == "end") {
			if (loop_stack.length == 0) {
				messages.push(
					{
						code: '',
						message: '"end" command was found with no matching "loop""',
						range: r,
						severity: vscode.DiagnosticSeverity.Error,
						source: ''
					})

			} else {
				loop_stack.pop()
			}
		}
	}
	for (let r of loop_stack) {
		messages.push(
			{
				code: '',
				message: 'loop was never closed',
				range: r,
				severity: vscode.DiagnosticSeverity.Error,
				source: ''
			})

	}
	collection.set(document.uri, messages);
}