"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function getWordAtPosition(document, position) {
    const wordRange = document.getWordRangeAtPosition(position);
    if (wordRange) {
        return document.getText(wordRange);
    }
    return '';
}
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.insertConsoleLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
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
function deactivate() { }
//# sourceMappingURL=extension.js.map