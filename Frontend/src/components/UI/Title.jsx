import { useTheme } from "../../Main/ThemeContext";

export default function Title({ titleName, pageDescription }) {
    const { theme } = useTheme();

    return (
        <div className=" h-fit">
            <div className="flex flex-col w-fit ">
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-color-black" : "black-text-color"}`}>{titleName}</p>
                <p className="text-sm text-slate-500">{pageDescription}</p>
            </div>
        </div>
    )
}