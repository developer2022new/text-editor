"use client"

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface Block {
  id: string;
  content: string;
}

const NotionLikeEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', content: '' }]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

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
  }

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block =>
        block.id === id ? { ...block, content } : block
    ));
  }

  const handleMouseDown = (e: React.MouseEvent, blockId: string) => {
    setIsDragging(true);
    setDraggedBlockId(blockId);
    setDragStartY(e.clientY);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedBlockId) {
      const newOffset = e.clientY - dragStartY;
      setDragOffset(newOffset);

      const draggedIndex = blocks.findIndex(block => block.id === draggedBlockId);
      const hoveredIndex = blocks.findIndex(block => block.id === hoveredId);

      if (hoveredIndex !== -1 && hoveredIndex !== draggedIndex) {
        const newBlocks = [...blocks];
        const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
        newBlocks.splice(hoveredIndex, 0, draggedBlock);
        setBlocks(newBlocks);
        setDragStartY(e.clientY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedBlockId(null);
    setDragOffset(0);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getDraggingStyle = (block: Block) => {
    if (isDragging && block.id === draggedBlockId) {
      return {
        transform: `translateY(${dragOffset}px)`,
        zIndex: 1000,
        opacity: 0.8,
        transition: 'none',
      };
    }
    return {
      transition: 'transform 0.3s ease',
    };
  };

  return (
      <div className="flex w-screen h-screen font-medium text-black bg-white">
        <div className="flex w-full h-full justify-center items-start mt-40 text-[12px] font-medium">
          <div
              ref={editorRef}
              onMouseLeave={() => setHoveredId(null)}
              onMouseMove={handleMouseMove}
          >
            {blocks.map((block, index) => (
                <div
                    key={block.id}
                    className="flex w-[920px] h-fit items-center rounded-[12px]"
                    onMouseEnter={() => setHoveredId(block.id)}
                    style={getDraggingStyle(block) as React.CSSProperties}
                >
                  <div
                      onMouseDown={(e) => handleMouseDown(e, block.id)}
                      className="flex w-[40px] rounded-[12px] items-center justify-center cursor-move"
                  >
                    {hoveredId === block.id &&
                        <div className="grid w-[18px] h-[28px] px-[4px] py-[6px] gap-[2px] rounded-[8px] grid-cols-2 bg-[#016FEE]/20">
                          {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="w-[4px] h-[4px] rounded-full bg-[#016FEE]" />
                          ))}
                        </div>
                    }
                  </div>

                  <div className={`flex w-[860px] h-fit rounded-[12px] items-center cursor-text ${focusedId === block.id ? 'shadow-[0px_0px_10px_1px_rgba(1,111,238,0.16)]' : ''}`}>
                    <div className="w-full h-fit p-[12px]">
                      {!block.content && focusedId !== block.id && (
                          <div className="absolute text-gray-400 pointer-events-none">
                            Salam...
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

                  <div className="flex w-[40px] rounded-[12px] items-center justify-center">
                    {hoveredId === block.id &&
                        <div className="flex p-[4px] rounded-[12px] items-center justify-center bg-[#016FEE]/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M16.3342 2.75H7.66521C4.64421 2.75 2.75021 4.889 2.75021 7.916V16.084C2.75021 19.111 4.63421 21.25 7.66521 21.25H16.3332C19.3642 21.25 21.2502 19.111 21.2502 16.084V7.916C21.2502 4.889 19.3642 2.75 16.3342 2.75Z"
                                  stroke="#016FEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.9394 12.0129H15.9484" stroke="#016FEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.9304 12.0129H11.9394" stroke="#016FEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.92142 12.0129H7.93042" stroke="#016FEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                    }
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default NotionLikeEditor;