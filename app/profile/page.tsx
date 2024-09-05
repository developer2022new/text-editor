"use client"

import ProfilePhotoUpload from "@/app/profile/profilePhotoUpload"
import ImageUpload from '@/app/profile/imageUpload'
import {useState} from "react"
import {cn} from "@/lib/utils"

const Page = () => {
    const [isActive, setIsActive] = useState(false)

    return (
        <div className="flex w-screen h-screen items-center justify-center font-medium text-black bg-[#D9D9D9]">
            <div className="w-[100px] h-full bg-[#D9D9D9D]">
            </div>
            <div className="flex flex-1 flex-col w-full h-full bg-white">
                <div className="flex w-full h-[400px] bg-white">
                    <ImageUpload />
                </div>
                <div className={"absolute w-[320px] h-[200px] rounded-full bg-white top-[300px] left-[160px]"}>
                    <ProfilePhotoUpload />
                </div>
                <button className={"absolute w-[124px] h-[44px] rounded-[20px] top-[380px] right-[50px] items-center justify-center border-[4px] border-white text-[14px] text-white bg-[#006AFF]"}>
                    İzlə
                </button>
                <div onClick={() => setIsActive(!isActive)} className={cn("absolute w-[1000px] h-[380px] rounded-tl-[36px] bottom-0 right-0 bg-[#D9D9D9] transition-all ease-in-out duration-300", isActive && "w-[1220px] h-[800px]")}>

                </div>
            </div>
        </div>
    )
}

export default Page