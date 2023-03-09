import classNames from 'classnames';
import { useRouter } from 'next/router';

function ActiveLink({ children, href, className }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={classNames(className, { active: router.asPath === href })}
    >
      {children}
    </a>
  );
}

export default ActiveLink;
