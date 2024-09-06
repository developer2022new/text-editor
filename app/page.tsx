"use client";

import React, { useEffect, useState, useRef, KeyboardEvent } from "react";

interface Item {
  id: number;
  content: string;
}

const Page: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [list, setList] = useState<Item[]>([
      // { id: 1, content: "" },
      { id: 1, content: "What is Lorem Ipsum?" },
      { id: 2, content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n Why do we use it?" },
      { id: 3, content: "Why do we use it?" },
      { id: 4, content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." },
      { id: 5, content: "Where does it come from?" },
      { id: 6, content: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32." },
      { id: 7, content: "Where can I get some?" },
      { id: 8, content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc." }
  ]);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newBlock = { id: Date.now(), content: "" };
      const newBlocks = [...list];
      newBlocks.splice(index + 1, 0, newBlock);
      setList(newBlocks);
      setTimeout(() => {
        const newBlockElement = document.getElementById(`${newBlock.id}`);
        newBlockElement?.focus();
      }, 0);
    } else if (
        e.key === "Backspace" &&
        list[index].content === "" &&
        list.length > 1
    ) {
      e.preventDefault();
      const newBlocks = list.filter((_, i) => i !== index);
      setList(newBlocks);
      setTimeout(() => {
        const prevBlockElement = document.getElementById(
            `${newBlocks[Math.max(0, index - 1)].id}`
        );
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

  const updateBlockContent = (id: number, content: string) => {
    setList(
        list.map((item) =>
            item.id === id ? { ...item, content } : item
        )
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const closestElem = document.elementFromPoint(e.clientX, e.clientY);
      const dragOverItem = closestElem?.closest(
          "[data-index]"
      ) as HTMLElement;

      if (dragOverItem) {
        const overIndex = Number(dragOverItem.dataset.index);
        dragOverItemIndex.current = overIndex;

        const listCopy = [...list];
        const dragItemContent = listCopy[dragItemIndex.current!];
        listCopy.splice(dragItemIndex.current!, 1);
        listCopy.splice(overIndex, 0, dragItemContent);

        dragItemIndex.current = overIndex;
        setList(listCopy);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveItem(null);
      dragItemIndex.current = null;
      dragOverItemIndex.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, list]);

  const handleMouseDown = (item: Item, index: number) => {
    setIsDragging(true);
    setActiveItem(item);
    dragItemIndex.current = index;
  };

  const getDraggingStyle = (item: Item) => {
    if (activeItem && isDragging && item.id === activeItem.id) {
      return {
        opacity: 1,
        background: "white",
        transform: "scale(1.0)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
      };
    }
    return {
      transition: "transform 0.3s ease",
    };
  };

  return (
      <div className={`flex w-screen h-screen items-center justify-center font-medium text-[12px] text-black bg-white ${isDragging && "select-none"}`}>
        <div
            onMouseLeave={() => setHoveredId(null)}
            className={"w-fit h-fit rounded-[20px]"}
        >
          {list.map((item, index) => (
              <div
                  key={item.id}
                  data-index={index}
                  onMouseEnter={() => setHoveredId(item.id)}
                  style={getDraggingStyle(item) as React.CSSProperties}
                  className={`flex w-[920px] h-fit rounded-[12px] items-start bg-white cursor-move ${
                      activeItem?.id === item.id ? "bg-green-500/20" : ""
                  }`}
              >





                <div
                    onMouseDown={() => handleMouseDown(item, index)}
                    className="flex w-[40px] rounded-[12px] my-auto items-center justify-center cursor-move"
                >
                  {hoveredId === item.id && (
                      <div className="grid w-[18px] h-[28px] px-[4px] py-[6px] gap-[2px] rounded-[8px] grid-cols-2 bg-[#016FEE]/20">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[4px] h-[4px] rounded-full bg-[#016FEE]"
                            />
                        ))}
                      </div>
                  )}
                </div>






                <div
                    className={`flex w-[860px] h-fit rounded-[12px] items-center cursor-text ${
                        (hoveredId === item.id && isDragging) || focusedId === item.id
                            ? "shadow-[0px_0px_10px_1px_rgba(1,111,238,0.16)]"
                            : ""
                    }`}
                >
                  <div className="flex w-full h-fit p-[12px]">
                    {/*{!item.content && focusedId !== item.id && (*/}
                    {/*    <div className="text-gray-400 pointer-events-none">*/}
                    {/*       What is Lorem Ipsum?*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    <div
                        id={`${item.id}`}
                        className="outline-none w-full h-fit"
                        contentEditable
                        onFocus={() => setFocusedId(item.id)}
                        onBlur={() => setFocusedId(null)}
                        onInput={(e) =>
                            updateBlockContent(item.id, e.currentTarget.textContent || "")
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                      {item.content}
                    </div>
                  </div>
                </div>






                {/*<div className="flex w-[40px] rounded-[12px] items-center justify-center">*/}
                {/*  {hoveredId === item.id && (*/}
                {/*      <div className="flex p-[4px] rounded-[12px] items-center justify-center bg-[#016FEE]/20">*/}
                {/*        <svg*/}
                {/*            xmlns="http://www.w3.org/2000/svg"*/}
                {/*            width="24"*/}
                {/*            height="24"*/}
                {/*            viewBox="0 0 24 24"*/}
                {/*            fill="none"*/}
                {/*        >*/}
                {/*          <path*/}
                {/*              fillRule="evenodd"*/}
                {/*              clipRule="evenodd"*/}
                {/*              d="M16.3342 2.75H7.66521C4.64421 2.75 2.75021 4.889 2.75021 7.916V16.084C2.75021 19.111 4.63421 21.25 7.66521 21.25H16.3332C19.3642 21.25 21.2502 19.111 21.2502 16.084V7.916C21.2502 4.889 19.3642 2.75 16.3342 2.75Z"*/}
                {/*              stroke="#016FEE"*/}
                {/*              strokeWidth="1.5"*/}
                {/*              strokeLinecap="round"*/}
                {/*              strokeLinejoin="round"*/}
                {/*          />*/}
                {/*          <path*/}
                {/*              d="M15.9394 12.0129H15.9484"*/}
                {/*              stroke="#016FEE"*/}
                {/*              strokeWidth="2"*/}
                {/*              strokeLinecap="round"*/}
                {/*              strokeLinejoin="round"*/}
                {/*          />*/}
                {/*          <path*/}
                {/*              d="M11.9304 12.0129H11.9394"*/}
                {/*              stroke="#016FEE"*/}
                {/*              strokeWidth="2"*/}
                {/*              strokeLinecap="round"*/}
                {/*              strokeLinejoin="round"*/}
                {/*          />*/}
                {/*          <path*/}
                {/*              d="M7.92142 12.0129H7.93042"*/}
                {/*              stroke="#016FEE"*/}
                {/*              strokeWidth="2"*/}
                {/*              strokeLinecap="round"*/}
                {/*              strokeLinejoin="round"*/}
                {/*          />*/}
                {/*        </svg>*/}
                {/*      </div>*/}
                {/*  )}*/}
                {/*</div>*/}
              </div>
          ))}
        </div>
      </div>
  );
};

export default Page;
