const ProgressBar = ({ step, total, label }) => (
    <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-center">
            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                Passo {step} de {total}
            </p>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
                {label}
            </p>
        </div>
        <div className="rounded-full bg-[#dbe0e6] dark:bg-[#2e363d] h-2 w-full overflow-hidden">
            <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(step / total) * 100}%` }}
            ></div>
        </div>
    </div>
);

export default ProgressBar;
