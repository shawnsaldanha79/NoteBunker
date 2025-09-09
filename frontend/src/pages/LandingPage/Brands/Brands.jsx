import { IoIosPartlySunny } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";
import { SiPythonanywhere } from "react-icons/si";
import { TbPackageExport } from "react-icons/tb";
import { FcAssistant } from "react-icons/fc";
import BrandItem from "./BrandItem";

const Brands = () => {
    return (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 pt-10 md:px-0 px-5">
            <BrandItem
                title="World Class Security"
                text="Bank-level encryption keeps your notes safe and private. Your data is protected with military-grade security protocols."
                icon={MdOutlineSecurity}
            />
            <BrandItem
                title="Global Access"
                text="Access your notes from anywhere in the world. Your notes sync across all your devices in real-time."
                icon={AiOutlineGlobal}
            />
            <BrandItem
                title="Always Available"
                text="99.9% uptime guarantee. Your notes are always available when you need them, day or night."
                icon={IoIosPartlySunny}
            />
            <BrandItem
                title="Cross-Platform"
                text="Works seamlessly on all devices and platforms. Access your notes from web, mobile, or desktop."
                icon={SiPythonanywhere}
            />
            <BrandItem
                title="Easy Export"
                text="Export your notes in multiple formats. Share or backup your notes with just one click."
                icon={TbPackageExport}
            />
            <BrandItem
                title="24/7 Support"
                text="Our dedicated support team is always ready to help you with any questions or issues."
                icon={FcAssistant}
            />
        </div>
    );
};

export default Brands;
