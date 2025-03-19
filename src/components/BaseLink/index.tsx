import { Link } from 'react-router';

export type BaseLinkProps = React.ComponentProps<typeof Link>;

const BaseLink = (props: BaseLinkProps) => {
  return <Link {...props} />;
};

export default BaseLink;
