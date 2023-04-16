import React from "react";
import { TopNav } from "../../components/TopNav";
import { Footer } from "../../components/Footer";

export const dynamicParams = false;

export default ({ children }) => {
    return (
        <>
            <TopNav />
            <article className="container mx-auto px-2 mt-2 mb-4">{children}</article>
            <Footer />
        </>
    );
};