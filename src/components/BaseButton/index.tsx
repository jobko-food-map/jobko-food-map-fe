export type BaseButtonProps = React.ComponentProps<'button'>;

const BaseButton = (props: BaseButtonProps) => {
  return <button type='button' {...props} />;
};

export default BaseButton;
