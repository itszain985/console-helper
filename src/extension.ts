import * as vscode from 'vscode';

function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    const wordRange = document.getWordRangeAtPosition(position);
    if (wordRange) {
        return document.getText(wordRange);
    }
    return '';
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.insertConsoleLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selections = editor.selections;
        const documentText = editor.document.getText();

        editor.edit(editBuilder => {
            selections.forEach(selection => {
                let selectedText = editor.document.getText(selection).trim();

                if (!selectedText) {
                    selectedText = getWordAtPosition(editor.document, selection.active);
                }

                if (!selectedText) {
                    vscode.window.showInformationMessage('Please select a variable or place cursor on a variable.');
                    return;
                }

                const regex = new RegExp(`console\\.log\\("${selectedText}------> \\((\\d+)\\)"`, 'g');
                let maxCount = 0;
                let match;
                while ((match = regex.exec(documentText)) !== null) {
                    const countNum = parseInt(match[1]);
                    if (countNum > maxCount) {
                        maxCount = countNum;
                    }
                }
                const newCount = maxCount + 1;

                const currentLineNum = selection.active.line;
                const currentLine = editor.document.lineAt(currentLineNum);
                const indent = currentLine.text.substring(0, currentLine.firstNonWhitespaceCharacterIndex);
   
                const logStatement = `${indent}console.log("${selectedText}------> (${newCount})", ${selectedText});\n`;

                const insertPosition = new vscode.Position(currentLineNum + 1, 0);
                editBuilder.insert(insertPosition, logStatement);
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
