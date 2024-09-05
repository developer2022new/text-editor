"use client"

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface Block {
    id: string;
    content: string;
}

interface FormattingOptions {
    color: string;
    fontWeight: string;
    fontSize: string;
}

const NotionLikeEditor = () => {
    const [blocks, setBlocks] = useState<Block[]>([{ id: '1', content: '' }]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [showFormatting, setShowFormatting] = useState(false);
    const [formattingPosition, setFormattingPosition] = useState({ top: 0, left: 0 });
    const editorRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newBlock = { id: Date.now().toString(), content: '' };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
            setTimeout(() => {
                const newBlockElement = document.getElementById(newBlock.id);
                newBlockElement?.focus();
            }, 0);
        } else if (e.key === 'Backspace' && blocks[index].content === '' && blocks.length > 1) {
            e.preventDefault();
            const newBlocks = blocks.filter((_, i) => i !== index);
            setBlocks(newBlocks);
            setTimeout(() => {
                const prevBlockElement = document.getElementById(newBlocks[Math.max(0, index - 1)].id);
                prevBlockElement?.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(prevBlockElement!);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }, 0);
        }
    };

    const updateBlockContent = (id: string, content: string) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, content } : block
        ));
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setFormattingPosition({
                top: rect.top - 40,
                left: rect.left
            });
            setShowFormatting(true);
        } else {
            setShowFormatting(false);
        }
    };

    const applyFormatting = (options: Partial<FormattingOptions>) => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            if (options.color) span.style.color = options.color;
            if (options.fontWeight) span.style.fontWeight = options.fontWeight;
            if (options.fontSize) span.style.fontSize = `${options.fontSize}px`;
            range.surroundContents(span);
            setShowFormatting(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setShowFormatting(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4" ref={editorRef}>
            {blocks.map((block, index) => (
                <div
                    key={block.id}
                    className={`rounded-lg p- mb- transition-shadow ${
                        focusedId === block.id ? 'shadow-lg' : 'shadow-sm'
                    }`}
                >
                    <div className="relative">
                        {!block.content && focusedId !== block.id && (
                            <div className="absolute top-0 left-0 text-gray-400 pointer-events-none">
                                {"Type '/' for commands"}
                            </div>
                        )}
                        <div
                            id={block.id}
                            className="outline-none"
                            contentEditable
                            onFocus={() => setFocusedId(block.id)}
                            onBlur={() => setFocusedId(null)}
                            onInput={(e) => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onMouseUp={handleTextSelection}
                        />
                    </div>
                </div>
            ))}
        {/*    {showFormatting && (*/}
        {/*    <div*/}
        {/*        className="absolute bg-white border border-gray-200 rounded shadow-lg p-2 flex items-center"*/}
        {/*        style={{ top: `${formattingPosition.top}px`, left: `${formattingPosition.left}px` }}*/}
        {/*    >*/}
        {/*        <div className="mr-2">*/}
        {/*            {['red', 'blue', 'green', 'yellow', 'purple'].map((color) => (*/}
        {/*                <button*/}
        {/*                    key={color}*/}
        {/*                    className="w-6 h-6 m-1 rounded-full"*/}
        {/*                    style={{ backgroundColor: color }}*/}
        {/*                    onClick={() => applyFormatting({ color })}*/}
        {/*                />*/}
        {/*            ))}*/}
        {/*        </div>*/}
        {/*        <div className="mr-2">*/}
        {/*            {['400', '500', '600'].map((weight) => (*/}
        {/*                <button*/}
        {/*                    key={weight}*/}
        {/*                    className="px-2 py-1 m-1 border rounded"*/}
        {/*                    onClick={() => applyFormatting({ fontWeight: weight })}*/}
        {/*                >*/}
        {/*                    {weight}*/}
        {/*                </button>*/}
        {/*            ))}*/}
        {/*        </div>*/}
        {/*        <div>*/}
        {/*            {['12', '16', '20'].map((size) => (*/}
        {/*                <button*/}
        {/*                    key={size}*/}
        {/*                    className="px-2 py-1 m-1 border rounded"*/}
        {/*                    onClick={() => applyFormatting({ fontSize: size })}*/}
        {/*                >*/}
        {/*                    {size}*/}
        {/*                </button>*/}
        {/*            ))}*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*)}*/}
        </div>
    );
};

export default NotionLikeEditor;