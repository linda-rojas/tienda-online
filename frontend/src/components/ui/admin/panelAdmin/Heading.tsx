import { ReactNode } from "react";

export default function Heading({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-xl my-10 text-gray-800">{children}</h1>
    );
}
