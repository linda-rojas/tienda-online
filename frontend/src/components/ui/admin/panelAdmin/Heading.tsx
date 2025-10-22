import { ReactNode } from "react";

export default function Heading({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-xl my-10">{children}</h1>
    );
}
