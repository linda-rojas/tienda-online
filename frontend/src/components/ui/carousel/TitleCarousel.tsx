export default function TitleCarousel({ title }: { title: string }) {
    return (
        <div className="w-full flex justify-center mb-3">
            <h2 className="text-[20px] font-semibold text-blue-600 mb-4 text-center border-2 p-2 rounded-md border-blue-500 bg-gray-100">
                {title}
            </h2>
        </div>
    );
}
