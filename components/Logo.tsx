import Image from 'next/image';

type LogoProps = {
  width?: number;
  height?: number;
};

function Logo({width = 50, height = width, ...rest}: LogoProps) {
  const link = '/logo.png';

  return (
    <Image
      alt="Logo"
      priority
      src={link}
      {...rest}
      width={width}
      height={height}
    />
  );
}

export default Logo;
