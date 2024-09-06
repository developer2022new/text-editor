"use client"

import React, { useEffect, useState, useRef } from 'react'

interface Item {
    id: number;
}

const Page: React.FC = () => {
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [activeItem, setActiveItem] = useState<Item | null>(null)
    const [list, setList] = useState<Item[]>([
        {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5},
        {id: 6}, {id: 7}, {id: 8}, {id: 9},
    ])

    const dragItemIndex = useRef<number | null>(null)
    const dragOverItemIndex = useRef<number | null>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            const closestElem = document.elementFromPoint(e.clientX, e.clientY)
            const dragOverItem = closestElem?.closest('[data-index]') as HTMLElement

            if (dragOverItem) {
                const overIndex = Number(dragOverItem.dataset.index)
                dragOverItemIndex.current = overIndex

                const listCopy = [...list]
                const dragItemContent = listCopy[dragItemIndex.current!]
                listCopy.splice(dragItemIndex.current!, 1)
                listCopy.splice(overIndex, 0, dragItemContent)

                dragItemIndex.current = overIndex
                setList(listCopy)
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setActiveItem(null)
            dragItemIndex.current = null
            dragOverItemIndex.current = null
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, list])

    const handleMouseDown = (e: React.MouseEvent, item: Item, index: number) => {
        setIsDragging(true)
        setActiveItem(item)
        dragItemIndex.current = index
    }

    const getDraggingStyle = (item: Item) => {
        if (activeItem && isDragging && item.id === activeItem.id) {
            return {
                opacity: 0.5,
                background: 'lightblue',
                transform: 'scale(1.05)',
                transition: 'opacity 0.2s ease, transform 0.2s ease'
            }
        }
        return {
            transition: 'transform 0.3s ease'
        }
    }

    return (
        <div className="flex w-screen h-screen items-center justify-center font-medium text-[16px] text-black bg-white">
            <div className="w-[800px] h-[600px] space-y-2 p-[20px] rounded-[20px] bg-blue-500">
                {list.map((item, index) => (
                    <div
                        key={item.id}
                        data-index={index}
                        onMouseDown={(e) => handleMouseDown(e, item, index)}
                        style={getDraggingStyle(item) as React.CSSProperties}
                        className={`w-full h-[40px] rounded-[12px] bg-white cursor-move
                            ${activeItem?.id === item.id ? "bg-green-500/20" : ""}
                        `}
                    />
                ))}
            </div>
        </div>
    );
};

export default Page;