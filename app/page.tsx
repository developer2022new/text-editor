"use client"

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface Block {
  id: string;
  content: string;
}

const NotionLikeEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', content: '' }]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
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


  return (
      <div className="flex w-screen h-screen font-medium text-black bg-white">
        <div className={"flex w-full h-full justify-center items-start mt-40 text-[12px] font-medium"}>
          <div ref={editorRef}>
            {blocks.map((block, index) => (
                <div
                    key={block.id}
                    className={`w-[880px] p-[12px] rounded-[12px] ${focusedId === block.id && "shadow-[0px_0px_10px_1px_rgba(1,111,238,0.16)]"}`}
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
                    />
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default NotionLikeEditor;