import { IoIosArrowForward } from "react-icons/io";
import Title from "../../components/UI/Title"

export default function ViewAll({ setActiveTab }) {
    return (
        <>
        <div className="text-black">
            <div className="flex gap-2 items-center">
                <div onClick={() => setActiveTab("Dashboard")} className="cursor-pointer flex gap-2">
                    <Title titleName={"Dashboard"}  />
                    
                </div>
                <span className="text-slate-500 translate-y-0.5"><IoIosArrowForward /></span>

                <p className="text-black">All Data</p>
            </div>
            All Datas Here
        </div>
        </>
    )
}