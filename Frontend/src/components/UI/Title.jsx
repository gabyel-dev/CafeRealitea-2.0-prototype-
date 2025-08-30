export default function Title({ titleName, pageDescription }) {
    return (
        <div className=" h-fit">
            <div className="flex flex-col w-fit ">
                <p className="text-2xl text-slate-700 font-bold">{titleName}</p>
                <p className="text-sm text-slate-500">{pageDescription}</p>
            </div>
        </div>
    )
}