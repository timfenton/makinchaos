import Link from "next/link"
import Image from 'next/image'
import logo from '../assets/makinchaos-logo-transparent-bg.svg'

interface ChaosLogoProps {
    className?: string;
    linkHref?: string;
    size?: number;
}

const ChaosLogo: React.FC<ChaosLogoProps> = ({ className, linkHref, size }) => {
    const logoSize = size ?? 75;

    return (
        <div className={className}>
            <Link href={linkHref ?? '/'}>
                <Image 
                    alt='Makin Chaos logo' 
                    src={logo} 
                    style={{
                        height: `${logoSize}px`,
                        width: `${logoSize}px`,
                    }} />
            </Link>
        </div>
    );
}

export default ChaosLogo;