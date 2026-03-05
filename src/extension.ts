import * as vscode from 'vscode';
const markdownItContainer = require('markdown-it-container');

export function activate(context: vscode.ExtensionContext) {
    console.log('Расширение активировано!');

    return {
        extendMarkdownIt(md: any) {
            console.log('extendMarkdownIt вызван!');

            // --- Блок :::alert ---
            md.use(markdownItContainer, 'alert', {
                validate: (params: string) => {
                    return params.trim().match(/^alert\s*(.*)$/);
                },
                render: (tokens: any, idx: number) => {
                    const token = tokens[idx];
                    if (token.nesting === 1) {
                        const title = token.info.trim().replace(/^alert/, '').trim() || 'Внимание';
                        return `<div class="alert" title="${title}"><strong>${title}</strong><br/>`;
                    } else {
                        return `</div>`;
                    }
                }
            });

            // --- Блок ???spoiler ---
            md.use(markdownItContainer, 'spoiler', {
                marker: '?',
                validate: (params: string) => {
                    return params.trim().match(/^spoiler\s+(.*)$/);
                },
                render: (tokens: any, idx: number) => {
                    const token = tokens[idx];
                    if (token.nesting === 1) {
                        const match = token.info.trim().match(/^spoiler\s+"([^"]+)"|^spoiler\s+'([^']+)'|^spoiler\s+(\S+)/);
                        let summaryText = 'Спойлер';
                        if (match) {
                            summaryText = match[1] || match[2] || match[3] || summaryText;
                        }
                        return `<div class="spoiler"><details><summary>${summaryText}</summary>`;
                    } else {
                        return `</details></div>`;
                    }
                }
            });

            return md;
        }
    };
}

export function deactivate() {}	