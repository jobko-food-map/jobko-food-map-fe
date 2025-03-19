import { NavLink } from 'react-router';

export type BaseNavLinkProps = React.ComponentProps<typeof NavLink>;

const BaseNavLink = (props: BaseNavLinkProps) => {
  return <NavLink {...props} />;
};

export default BaseNavLink;
