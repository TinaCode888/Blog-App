import React from "react";

function Footer(){
    const date = new Date();
    return <footer>&copy; BlogSite {date.getFullYear()}</footer>;
}

export default Footer;